import { getStoredUser } from '@/utils/authStorage'
import { listStoredMaintenance } from '@/services/maintenanceService'
import { listStoredVehicles } from '@/services/vehicleService'
import { toCents } from '@/utils/maintenanceCalculations'

const STORAGE_KEY = 'city-rental-car.expenses'

function dollars(cents) {
  return cents / 100
}

const seed = [
  {
    id: 'EXP-2026-3001',
    expenseReference: 'EXP-2026-3001',
    title: 'Airport fuel',
    description: 'Fuel for the Prado before the October rental block.',
    category: 'Fuel',
    amount: 80,
    currency: 'USD',
    expenseDate: '2026-10-03',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    amountPaid: 80,
    approvalStatus: 'Approved',
    approvedBy: 'user-003',
    approvedAt: '2026-10-03T12:00:00.000Z',
    rejectionReason: '',
    vehicleId: 'toyota-prado',
    maintenanceId: null,
    vendor: 'City Fuel Stop',
    receiptReference: 'RCT-441',
    notes: '',
    createdBy: 'user-003',
    createdAt: '2026-10-03T09:00:00.000Z',
    updatedAt: '2026-10-03T12:00:00.000Z',
  },
  {
    id: 'EXP-2026-3002',
    expenseReference: 'EXP-2026-3002',
    title: 'October office rent',
    description: 'Desk rent for the city center office. Not paid yet.',
    category: 'Office Rent',
    amount: 400,
    currency: 'USD',
    expenseDate: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Unpaid',
    amountPaid: 0,
    approvalStatus: 'Pending',
    approvedBy: '',
    approvedAt: null,
    rejectionReason: '',
    vehicleId: null,
    maintenanceId: null,
    vendor: 'Hodan Properties',
    receiptReference: '',
    notes: '',
    createdBy: 'user-002',
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'EXP-2026-3003',
    expenseReference: 'EXP-2026-3003',
    title: 'Social ad trial',
    description: 'A short marketing trial that was rejected and not paid.',
    category: 'Marketing',
    amount: 60,
    currency: 'USD',
    expenseDate: '2026-09-18',
    paymentMethod: 'Visa',
    paymentStatus: 'Cancelled',
    amountPaid: 0,
    approvalStatus: 'Rejected',
    approvedBy: 'user-003',
    approvedAt: '2026-09-19T10:00:00.000Z',
    rejectionReason: 'Outside the monthly marketing limit.',
    vehicleId: null,
    maintenanceId: null,
    vendor: 'Local Ads',
    receiptReference: 'RCT-220',
    notes: '',
    createdBy: 'user-002',
    createdAt: '2026-09-18T09:00:00.000Z',
    updatedAt: '2026-09-19T10:00:00.000Z',
  },
  {
    id: 'EXP-2026-3004',
    expenseReference: 'EXP-2026-3004',
    title: 'Fleet insurance installment',
    description: 'Approved insurance installment that has been paid.',
    category: 'Vehicle Insurance',
    amount: 150,
    currency: 'USD',
    expenseDate: '2026-10-06',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    amountPaid: 150,
    approvalStatus: 'Approved',
    approvedBy: 'user-004',
    approvedAt: '2026-10-06T15:00:00.000Z',
    rejectionReason: '',
    vehicleId: null,
    maintenanceId: null,
    vendor: 'Somali Cover',
    receiptReference: 'RCT-510',
    notes: '',
    createdBy: 'user-003',
    createdAt: '2026-10-06T09:00:00.000Z',
    updatedAt: '2026-10-06T15:00:00.000Z',
  },
  {
    id: 'EXP-2026-3005',
    expenseReference: 'EXP-2026-3005',
    title: 'Inspection workshop invoice',
    description: 'Explicit expense linked to maintenance MNT-2026-1004. The maintenance total is not added again.',
    category: 'Vehicle Maintenance',
    amount: 50,
    currency: 'USD',
    expenseDate: '2026-09-12',
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    amountPaid: 50,
    approvalStatus: 'Approved',
    approvedBy: 'user-003',
    approvedAt: '2026-09-12T16:00:00.000Z',
    rejectionReason: '',
    vehicleId: 'toyota-prado',
    maintenanceId: 'MNT-2026-1004',
    vendor: 'City Service Bay',
    receiptReference: 'RCT-318',
    notes: 'Linked expense only. Do not add the maintenance record cost on top of this amount.',
    createdBy: 'user-003',
    createdAt: '2026-09-12T12:00:00.000Z',
    updatedAt: '2026-09-12T16:00:00.000Z',
  },
  {
    id: 'EXP-2026-3006',
    expenseReference: 'EXP-2026-3006',
    title: 'Power bill deposit',
    description: 'Approved utility bill with only part of the amount paid.',
    category: 'Utilities',
    amount: 30,
    currency: 'USD',
    expenseDate: '2026-10-09',
    paymentMethod: 'EVC Plus',
    paymentStatus: 'Partially Paid',
    amountPaid: 10,
    approvalStatus: 'Approved',
    approvedBy: 'user-003',
    approvedAt: '2026-10-09T11:00:00.000Z',
    rejectionReason: '',
    vehicleId: null,
    maintenanceId: null,
    vendor: 'City Power',
    receiptReference: 'RCT-602',
    notes: '',
    createdBy: 'user-002',
    createdAt: '2026-10-09T09:00:00.000Z',
    updatedAt: '2026-10-09T11:00:00.000Z',
  },
]

export class ExpenseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ExpenseError'
  }
}

function delay(ms = 120) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function readAll() {
  if (typeof window === 'undefined') return seed.map((item) => ({ ...item }))
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return writeAll(seed)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : writeAll(seed)
  } catch {
    return writeAll(seed)
  }
}

function writeAll(records) {
  if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  return records
}

function actor() {
  const user = getStoredUser()
  return {
    id: user?.id || '',
    role: user?.role || '',
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Staff',
  }
}

export function canApproveExpenses(role = actor().role) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

function vehicles() {
  return new Map(listStoredVehicles().map((vehicle) => [vehicle.id, vehicle]))
}

function maintenanceRecords() {
  return new Map(listStoredMaintenance().map((record) => [record.id, record]))
}

function outstandingCents(expense) {
  return Math.max(0, (toCents(expense.amount) || 0) - (toCents(expense.amountPaid) || 0))
}

function present(expense, fleet = vehicles(), jobs = maintenanceRecords()) {
  const vehicle = expense.vehicleId ? fleet.get(expense.vehicleId) : null
  const maintenance = expense.maintenanceId ? jobs.get(expense.maintenanceId) : null
  return {
    ...expense,
    vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : '',
    vehicleMissing: Boolean(expense.vehicleId) && !vehicle,
    maintenanceReference: maintenance?.reference || '',
    maintenanceVehicleId: maintenance?.vehicleId || '',
    maintenanceMissing: Boolean(expense.maintenanceId) && !maintenance,
    outstanding: dollars(outstandingCents(expense)),
  }
}

function counted(expense) {
  return expense.approvalStatus !== 'Rejected'
}

export function expenseStats(records = [], today = new Date()) {
  const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const included = records.filter(counted)
  const sum = (items, pick) => dollars(items.reduce((total, item) => total + (toCents(pick(item)) || 0), 0))
  const pending = records.filter((item) => item.approvalStatus === 'Pending')
  const approved = records.filter((item) => item.approvalStatus === 'Approved')
  const rejected = records.filter((item) => item.approvalStatus === 'Rejected')
  return {
    recordedAmount: sum(included, (item) => item.amount),
    monthAmount: sum(included.filter((item) => item.expenseDate.startsWith(month)), (item) => item.amount),
    pendingCount: pending.length,
    pendingAmount: sum(pending, (item) => item.amount),
    approvedAmount: sum(approved, (item) => item.amount),
    rejectedCount: rejected.length,
    rejectedAmount: sum(rejected, (item) => item.amount),
    paidAmount: sum(included, (item) => item.amountPaid),
    unpaidAmount: sum(included.filter((item) => item.paymentStatus !== 'Cancelled'), (item) => item.outstanding ?? dollars(outstandingCents(item))),
    currency: 'USD',
    totalRecords: records.length,
  }
}

function analyticsFor(records) {
  const included = records.filter(counted)
  const categories = new Map()
  const months = new Map()
  included.forEach((expense) => {
    categories.set(expense.category, (categories.get(expense.category) || 0) + (toCents(expense.amount) || 0))
    const month = expense.expenseDate.slice(0, 7)
    months.set(month, (months.get(month) || 0) + (toCents(expense.amount) || 0))
  })
  return {
    categories: [...categories.entries()].map(([category, cents]) => ({ category, amount: dollars(cents) })).sort((a, b) => b.amount - a.amount),
    months: [...months.entries()].map(([month, cents]) => ({ month, amount: dollars(cents) })).sort((a, b) => a.month.localeCompare(b.month)),
    paidAmount: expenseStats(records).paidAmount,
    unpaidAmount: expenseStats(records).unpaidAmount,
    pendingAmount: expenseStats(records).pendingAmount,
    currency: 'USD',
  }
}

function nextReference(records) {
  const year = new Date().getFullYear()
  const used = new Set(records.map((item) => item.expenseReference))
  let reference = ''
  do {
    reference = `EXP-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`
  } while (used.has(reference))
  return reference
}

function relationships(data) {
  const fleet = vehicles()
  const jobs = maintenanceRecords()
  const vehicleId = data.vehicleId || null
  const maintenanceId = data.maintenanceId || null
  if (vehicleId && !fleet.has(vehicleId)) throw new ExpenseError('Choose a vehicle that exists in the fleet.')
  const job = maintenanceId ? jobs.get(maintenanceId) : null
  if (maintenanceId && !job) throw new ExpenseError('Choose a maintenance record that exists.')
  if (job && vehicleId && job.vehicleId !== vehicleId) {
    throw new ExpenseError('That maintenance record belongs to a different vehicle.')
  }
  return { vehicleId: vehicleId || job?.vehicleId || null, maintenanceId }
}

function paymentFigures(amount, paymentStatus, amountPaid) {
  const total = toCents(amount)
  if (paymentStatus === 'Paid') return { amountPaid: dollars(total), paymentStatus }
  if (paymentStatus === 'Unpaid' || paymentStatus === 'Cancelled') return { amountPaid: 0, paymentStatus }
  const paid = toCents(amountPaid)
  if (paid === null || paid <= 0 || paid >= total) throw new ExpenseError('A partial payment must be greater than zero and less than the full amount.')
  return { amountPaid: dollars(paid), paymentStatus: 'Partially Paid' }
}

function locked(expense) {
  return expense.approvalStatus !== 'Pending' || expense.paymentStatus === 'Paid' || expense.paymentStatus === 'Partially Paid'
}

export async function getExpenses(params = {}) {
  await delay()
  const fleet = vehicles()
  const jobs = maintenanceRecords()
  const records = readAll().map((item) => present(item, fleet, jobs))
  const search = String(params.search || '').trim().toLowerCase()
  const filtered = records.filter((expense) => {
    if (search) {
      const haystack = [expense.expenseReference, expense.title, expense.vendor, expense.description, expense.receiptReference].join(' ').toLowerCase()
      if (!haystack.includes(search)) return false
    }
    if (params.category && expense.category !== params.category) return false
    if (params.approvalStatus && expense.approvalStatus !== params.approvalStatus) return false
    if (params.paymentStatus && expense.paymentStatus !== params.paymentStatus) return false
    if (params.paymentMethod && expense.paymentMethod !== params.paymentMethod) return false
    if (params.vehicleId && expense.vehicleId !== params.vehicleId) return false
    if (params.dateFrom && expense.expenseDate < params.dateFrom) return false
    if (params.dateTo && expense.expenseDate > params.dateTo) return false
    return true
  })
  const sort = params.sort || 'newest'
  filtered.sort((left, right) => {
    if (sort === 'oldest') return left.expenseDate.localeCompare(right.expenseDate)
    if (sort === 'amount-asc') return left.amount - right.amount
    if (sort === 'amount-desc') return right.amount - left.amount
    if (sort === 'title') return left.title.localeCompare(right.title)
    return right.createdAt.localeCompare(left.createdAt)
  })
  const pageSize = params.pageSize || 4
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(Number(params.page) || 1, 1), pageCount)
  const start = (page - 1) * pageSize
  return {
    expenses: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageCount,
    pageSize,
    stats: expenseStats(records),
    analytics: analyticsFor(records),
    recent: [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
  }
}

export async function getExpenseStats() {
  await delay(60)
  return expenseStats(readAll().map((item) => present(item)))
}

export async function getExpenseAnalytics() {
  await delay(60)
  return analyticsFor(readAll().map((item) => present(item)))
}

export async function getExpenseById(id) {
  await delay(80)
  const expense = readAll().find((item) => item.id === id)
  return expense ? present(expense) : null
}

export function listExpenseOptions() {
  return {
    vehicles: listStoredVehicles(),
    maintenance: listStoredMaintenance(),
  }
}

export async function createExpense(data) {
  await delay()
  const links = relationships(data)
  const figures = paymentFigures(data.amount, data.paymentStatus, data.amountPaid)
  const records = readAll()
  const reference = nextReference(records)
  const now = new Date().toISOString()
  const record = {
    id: reference,
    expenseReference: reference,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    amount: Number(data.amount),
    currency: 'USD',
    expenseDate: data.expenseDate,
    paymentMethod: data.paymentMethod,
    paymentStatus: figures.paymentStatus,
    amountPaid: figures.amountPaid,
    approvalStatus: 'Pending',
    approvedBy: '',
    approvedAt: null,
    rejectionReason: '',
    vehicleId: links.vehicleId,
    maintenanceId: links.maintenanceId,
    vendor: data.vendor.trim(),
    receiptReference: String(data.receiptReference || '').trim(),
    notes: String(data.notes || '').trim(),
    createdBy: actor().id,
    createdAt: now,
    updatedAt: now,
  }
  writeAll([record, ...records])
  return present(record)
}

export async function updateExpense(id, data) {
  await delay()
  const records = readAll()
  const current = records.find((item) => item.id === id)
  if (!current) throw new ExpenseError('This expense could not be found.')
  const links = relationships(data)
  const now = new Date().toISOString()
  const descriptive = {
    title: data.title.trim(),
    description: data.description.trim(),
    vendor: data.vendor.trim(),
    receiptReference: String(data.receiptReference || '').trim(),
    notes: String(data.notes || '').trim(),
  }
  let next = { ...current, ...descriptive, updatedAt: now }
  if (!locked(current)) {
    const figures = paymentFigures(data.amount, data.paymentStatus, data.amountPaid)
    next = {
      ...next,
      category: data.category,
      amount: Number(data.amount),
      currency: 'USD',
      expenseDate: data.expenseDate,
      paymentMethod: data.paymentMethod,
      paymentStatus: figures.paymentStatus,
      amountPaid: figures.amountPaid,
      vehicleId: links.vehicleId,
      maintenanceId: links.maintenanceId,
    }
  }
  writeAll(records.map((item) => (item.id === id ? next : item)))
  return present(next)
}

export async function updateExpenseApproval(id, nextStatus, metadata = {}) {
  await delay()
  if (!canApproveExpenses()) throw new ExpenseError('Only an admin can approve or reject an expense. This mock action is not a real approval.')
  const records = readAll()
  const current = records.find((item) => item.id === id)
  if (!current) throw new ExpenseError('This expense could not be found.')
  if (current.approvalStatus !== 'Pending' || !['Approved', 'Rejected'].includes(nextStatus)) {
    throw new ExpenseError(`${current.approvalStatus} expenses cannot move to ${nextStatus}.`)
  }
  const now = new Date().toISOString()
  const user = actor()
  let next = {
    ...current,
    approvalStatus: nextStatus,
    approvedBy: user.id,
    approvedAt: now,
    updatedAt: now,
  }
  if (nextStatus === 'Rejected') {
    const reason = String(metadata.reason || '').trim()
    if (reason.length < 3) throw new ExpenseError('Enter a reason for the rejection.')
    if (current.paymentStatus === 'Paid' || current.paymentStatus === 'Partially Paid') {
      throw new ExpenseError('A paid expense cannot be rejected from this screen.')
    }
    next = { ...next, rejectionReason: reason, paymentStatus: 'Cancelled', amountPaid: 0 }
  }
  writeAll(records.map((item) => (item.id === id ? next : item)))
  return present(next)
}

const paymentTransitions = {
  Unpaid: ['Paid', 'Partially Paid', 'Cancelled'],
  'Partially Paid': ['Paid', 'Cancelled'],
  Paid: [],
  Cancelled: [],
}

export async function updateExpensePaymentStatus(id, nextStatus, metadata = {}) {
  await delay()
  const records = readAll()
  const current = records.find((item) => item.id === id)
  if (!current) throw new ExpenseError('This expense could not be found.')
  if (current.approvalStatus === 'Rejected') throw new ExpenseError('A rejected expense cannot be marked paid.')
  if (!paymentTransitions[current.paymentStatus]?.includes(nextStatus)) {
    throw new ExpenseError(`${current.paymentStatus} expenses cannot move to ${nextStatus}.`)
  }
  const figures = paymentFigures(current.amount, nextStatus, metadata.amountPaid)
  const next = { ...current, ...figures, updatedAt: new Date().toISOString() }
  writeAll(records.map((item) => (item.id === id ? next : item)))
  return present(next)
}

export async function deleteExpense() {
  throw new ExpenseError('Expenses stay on record. Reject a pending expense or cancel an unpaid one instead.')
}
