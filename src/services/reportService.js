import { listAdminBookings } from '@/services/bookingService'
import { getExpenses } from '@/services/expenseService'
import { getMaintenanceRecords } from '@/services/maintenanceService'
import { getPayments } from '@/services/paymentService'
import { listStoredVehicles } from '@/services/vehicleService'
import { isCollectedCharge, isRefund } from '@/utils/paymentCalculations'
import {
  bucketKey,
  cents,
  dayOf,
  eachDay,
  fromCents,
  groupMode,
  inRange,
  periodRange,
} from '@/utils/reportCalculations'

const ELIGIBLE_BOOKING = ['Pending', 'Confirmed', 'Active', 'Completed']
const USD = 'USD'

function money(records, pick) {
  return fromCents(records.reduce((sum, record) => sum + cents(pick(record)), 0))
}

function paymentDay(payment) {
  return dayOf(payment.paidAt || payment.createdAt)
}

function usd(record) {
  return !record.currency || record.currency === USD
}

export async function loadReportSources() {
  const [paymentsPage, expensesPage, maintenancePage] = await Promise.all([
    getPayments({ pageSize: 1000 }),
    getExpenses({ pageSize: 1000 }),
    getMaintenanceRecords({ pageSize: 1000 }),
  ])
  return {
    bookings: listAdminBookings(),
    payments: paymentsPage.payments.concat(await remainingPages(getPayments, paymentsPage)),
    expenses: expensesPage.expenses.concat(await remainingPages(getExpenses, expensesPage)),
    maintenance: maintenancePage.records.concat(await remainingPages(getMaintenanceRecords, maintenancePage, 'records')),
    vehicles: listStoredVehicles(),
  }
}

async function remainingPages(loader, first, key = null) {
  const listKey = key || (first.payments ? 'payments' : first.expenses ? 'expenses' : 'records')
  if (first.pageCount <= 1) return []
  const rest = []
  for (let page = 2; page <= first.pageCount; page += 1) {
    const next = await loader({ pageSize: first.pageSize, page })
    rest.push(...next[listKey])
  }
  return rest
}

function build(sources, range) {
  const bookings = sources.bookings.filter((booking) => inRange(dayOf(booking.createdAt), range))
  const eligible = bookings.filter((booking) => ELIGIBLE_BOOKING.includes(booking.status))
  const payments = sources.payments.filter((payment) => usd(payment) && inRange(paymentDay(payment), range))
  const otherCurrency = sources.payments.filter((payment) => !usd(payment) && inRange(paymentDay(payment), range))
  const collected = payments.filter(isCollectedCharge)
  const refunds = payments.filter(isRefund)
  const expenses = sources.expenses.filter((expense) => usd(expense) && inRange(expense.expenseDate, range))
  const approved = expenses.filter((expense) => expense.approvalStatus === 'Approved')
  const paidExpenses = approved.filter((expense) => Number(expense.amountPaid) > 0)
  const pendingExpenses = expenses.filter((expense) => expense.approvalStatus === 'Pending')
  const grossCollected = money(collected, (payment) => payment.amount)
  const refundTotal = money(refunds, (payment) => payment.amount)
  const netCollected = fromCents(cents(grossCollected) - cents(refundTotal))
  const paidExpenseTotal = money(paidExpenses, (expense) => expense.amountPaid)
  const linkedMaintenance = new Set(sources.expenses.map((expense) => expense.maintenanceId).filter(Boolean))
  const mode = groupMode(range)
  const buckets = new Map()
  const seedBuckets = mode === 'day' ? eachDay(range.from, range.to) : []
  seedBuckets.forEach((day) => buckets.set(day, { label: day, collected: 0, refunds: 0 }))
  collected.forEach((payment) => {
    const key = bucketKey(paymentDay(payment), mode)
    const current = buckets.get(key) || { label: key, collected: 0, refunds: 0 }
    current.collected = fromCents(cents(current.collected) + cents(payment.amount))
    buckets.set(key, current)
  })
  refunds.forEach((payment) => {
    const key = bucketKey(paymentDay(payment), mode)
    const current = buckets.get(key) || { label: key, collected: 0, refunds: 0 }
    current.refunds = fromCents(cents(current.refunds) + cents(payment.amount))
    buckets.set(key, current)
  })
  const trend = [...buckets.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([, point]) => ({ ...point, net: fromCents(cents(point.collected) - cents(point.refunds)) }))

  const bookingBuckets = new Map()
  bookings.forEach((booking) => {
    const key = bucketKey(dayOf(booking.createdAt), mode)
    bookingBuckets.set(key, (bookingBuckets.get(key) || 0) + 1)
  })
  const bookingOverTime = [...bookingBuckets.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([label, count]) => ({ label, count }))

  const statusCounts = ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected'].map((status) => ({
    status,
    count: bookings.filter((booking) => booking.status === status).length,
  }))
  const demandMap = new Map()
  sources.bookings
    .filter((booking) => ELIGIBLE_BOOKING.includes(booking.status) && inRange(booking.pickupDate, range))
    .forEach((booking) => demandMap.set(booking.pickupDate, (demandMap.get(booking.pickupDate) || 0) + 1))

  const categoryExpense = (items, pick) => {
    const map = new Map()
    items.forEach((expense) => map.set(expense.category, fromCents(cents(map.get(expense.category) || 0) + cents(pick(expense)))))
    return [...map.entries()].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount)
  }

  const monthExpense = new Map()
  paidExpenses.forEach((expense) => {
    const month = expense.expenseDate.slice(0, 7)
    monthExpense.set(month, fromCents(cents(monthExpense.get(month) || 0) + cents(expense.amountPaid)))
  })

  const methodMap = new Map()
  collected.forEach((payment) => methodMap.set(payment.paymentMethod, fromCents(cents(methodMap.get(payment.paymentMethod) || 0) + cents(payment.amount))))
  const paymentStatus = ['Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded', 'Partially Refunded'].map((status) => ({
    status,
    count: payments.filter((payment) => !isRefund(payment) && payment.status === status).length,
    amount: money(payments.filter((payment) => !isRefund(payment) && payment.status === status && isCollectedCharge(payment)), (payment) => payment.amount),
  }))

  const bookingCounts = new Map()
  eligible.forEach((booking) => {
    if (!booking.vehicle.id) return
    bookingCounts.set(booking.vehicle.id, (bookingCounts.get(booking.vehicle.id) || 0) + 1)
  })
  const maintenanceByVehicle = new Map()
  sources.maintenance.forEach((record) => {
    if (record.status !== 'Completed') return
    if (linkedMaintenance.has(record.id)) return
    if (!inRange(dayOf(record.completedAt || record.scheduledDate), range)) return
    maintenanceByVehicle.set(record.vehicleId, fromCents(cents(maintenanceByVehicle.get(record.vehicleId) || 0) + cents(record.totalCost)))
  })

  const fleet = sources.vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: `${vehicle.brand} ${vehicle.model}`,
    status: vehicle.status,
    bookings: bookingCounts.get(vehicle.id) || 0,
    maintenanceCost: maintenanceByVehicle.get(vehicle.id) || 0,
  })).sort((left, right) => right.bookings - left.bookings || left.name.localeCompare(right.name))

  const customers = new Map()
  eligible.forEach((booking) => {
    const key = booking.customer.email || booking.customer.name
    const current = customers.get(key) || { name: booking.customer.name, email: booking.customer.email, bookings: 0, completed: 0, completedValue: 0 }
    current.bookings += 1
    if (booking.status === 'Completed') {
      current.completed += 1
      current.completedValue = fromCents(cents(current.completedValue) + cents(booking.pricing.total))
    }
    customers.set(key, current)
  })
  const customerRows = [...customers.values()].sort((left, right) => right.completed - left.completed || right.bookings - left.bookings)
  const categories = new Map()
  eligible.forEach((booking) => {
    const category = booking.vehicle.category || 'Uncategorized'
    categories.set(category, (categories.get(category) || 0) + 1)
  })

  const outstanding = money(
    eligible.filter((booking) => booking.outstanding > 0),
    (booking) => booking.outstanding,
  )

  return {
    range,
    currency: USD,
    otherCurrencyCount: otherCurrency.length,
    summary: {
      totalBookings: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === 'Confirmed').length,
      completed: bookings.filter((booking) => booking.status === 'Completed').length,
      cancelled: bookings.filter((booking) => booking.status === 'Cancelled').length,
      grossBookingValue: money(eligible, (booking) => booking.pricing.total),
      paymentsCollected: grossCollected,
      refunds: refundTotal,
      netCollected,
      approvedExpenses: money(approved, (expense) => expense.amount),
      paidExpenses: paidExpenseTotal,
      netCashFlow: fromCents(cents(netCollected) - cents(paidExpenseTotal)),
    },
    trend,
    trendMode: mode,
    bookings: {
      statuses: statusCounts,
      overTime: bookingOverTime,
      demand: [...demandMap.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count })),
      average: eligible.length ? fromCents(Math.round(cents(money(eligible, (booking) => booking.pricing.total)) / eligible.length)) : null,
      eligibleCount: eligible.length,
      rows: bookings.map((booking) => ({
        reference: booking.bookingReference,
        created: dayOf(booking.createdAt),
        pickup: booking.pickupDate,
        customer: booking.customer.name,
        vehicle: `${booking.vehicle.brand} ${booking.vehicle.model}`,
        status: booking.status,
        total: booking.pricing.total,
      })),
    },
    expenses: {
      approvedByCategory: categoryExpense(approved, (expense) => expense.amount),
      paidByCategory: categoryExpense(paidExpenses, (expense) => expense.amountPaid),
      paidTrend: [...monthExpense.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([month, amount]) => ({ month, amount })),
      pendingCount: pendingExpenses.length,
      pendingAmount: money(pendingExpenses, (expense) => expense.amount),
      rows: expenses.map((expense) => ({
        reference: expense.expenseReference,
        date: expense.expenseDate,
        title: expense.title,
        category: expense.category,
        approval: expense.approvalStatus,
        payment: expense.paymentStatus,
        amount: expense.amount,
        paid: expense.amountPaid,
      })),
    },
    fleet: {
      total: sources.vehicles.length,
      available: sources.vehicles.filter((vehicle) => vehicle.status === 'Available').length,
      reserved: sources.vehicles.filter((vehicle) => vehicle.status === 'Reserved').length,
      rented: sources.vehicles.filter((vehicle) => vehicle.status === 'Rented').length,
      maintenance: sources.vehicles.filter((vehicle) => vehicle.status === 'Maintenance').length,
      inactive: sources.vehicles.filter((vehicle) => vehicle.status === 'Inactive').length,
      vehicles: fleet,
    },
    payments: {
      methods: [...methodMap.entries()].map(([method, amount]) => ({ method, amount })).sort((a, b) => b.amount - a.amount),
      statuses: paymentStatus,
      refunds: refundTotal,
      outstanding,
      rows: payments.filter((payment) => !isRefund(payment)).map((payment) => ({
        reference: payment.transactionReference,
        date: paymentDay(payment),
        method: payment.paymentMethod,
        type: payment.paymentType,
        status: payment.status,
        amount: payment.amount,
        manual: payment.manual ? 'Manual office record' : 'Sample record',
      })),
    },
    customers: {
      rows: customerRows,
      repeatCount: customerRows.filter((customer) => customer.bookings > 1).length,
      averageCompleted: customerRows.reduce((sum, customer) => sum + customer.completed, 0)
        ? fromCents(Math.round(cents(money(customerRows, (customer) => customer.completedValue)) / customerRows.reduce((sum, customer) => sum + customer.completed, 0)))
        : null,
      categories: [...categories.entries()].map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count),
    },
  }
}

export async function getReport(params) {
  const range = periodRange(params)
  if (range.error) return { error: range.error }
  const sources = await loadReportSources()
  return build(sources, range)
}

export async function getExecutiveSummary(params) {
  const report = await getReport(params)
  return report.error ? report : report.summary
}

export async function getRevenueTrend(params) {
  const report = await getReport(params)
  return report.error ? report : report.trend
}

export async function getBookingAnalytics(params) {
  const report = await getReport(params)
  return report.error ? report : report.bookings
}

export async function getExpenseAnalytics(params) {
  const report = await getReport(params)
  return report.error ? report : report.expenses
}

export async function getFleetPerformance(params) {
  const report = await getReport(params)
  return report.error ? report : report.fleet
}

export async function getPaymentAnalytics(params) {
  const report = await getReport(params)
  return report.error ? report : report.payments
}

export async function getCustomerAnalytics(params) {
  const report = await getReport(params)
  return report.error ? report : report.customers
}
