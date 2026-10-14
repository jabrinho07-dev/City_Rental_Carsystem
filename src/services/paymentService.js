import { listAdminBookings, updateBooking } from '@/services/bookingService'
import { ensurePayments, readPayments, writePayments } from '@/services/paymentStore'
import {
  bookingMoney,
  paymentStats,
  refundableBalance,
  refundedAmountFor,
} from '@/utils/paymentCalculations'

export const paymentMethods = ['Cash', 'EVC Plus', 'Zaad', 'Hormuud', 'Visa', 'Mastercard', 'Bank Transfer', 'Other']
export const paymentTypes = ['Full Payment', 'Deposit', 'Partial Payment', 'Refund']
export const chargeTypes = ['Full Payment', 'Deposit', 'Partial Payment']
export const paymentStatuses = ['Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded', 'Partially Refunded']
const PROVIDER_METHODS = ['EVC Plus', 'Zaad', 'Hormuud', 'Visa', 'Mastercard', 'Bank Transfer']

export class PaymentError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PaymentError'
  }
}

function delay(ms = 120) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function nextReference(existing) {
  const year = new Date().getFullYear()
  const used = new Set(existing.map((item) => item.transactionReference))
  let reference = ''
  do {
    reference = `PAY-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`
  } while (used.has(reference))
  return reference
}

function bookingsById() {
  return new Map(listAdminBookings().map((booking) => [booking.id, booking]))
}

function present(record, bookings, payments) {
  const booking = bookings.get(record.bookingId) || null
  const refundedAmount = record.paymentType === 'Refund' ? 0 : refundedAmountFor(payments, record.id)
  const money = booking ? bookingMoney(booking, payments) : null
  return {
    ...record,
    customerId: booking?.customer.id || '',
    customerName: booking?.customer.name || 'Booking unavailable',
    customerEmail: booking?.customer.email || '',
    customerPhone: booking?.customer.phone || '',
    bookingMissing: !booking,
    refundedAmount,
    netRetained: record.paymentType === 'Refund' ? 0 : Math.max(0, Number(record.amount || 0) - refundedAmount),
    refundable: refundableBalance(record, payments),
    bookingTotal: money?.total ?? null,
    bookingPaid: money?.netPaid ?? null,
    bookingOutstanding: money?.outstanding ?? null,
    bookingStatus: booking?.status || '',
    vehicleName: booking ? `${booking.vehicle.brand} ${booking.vehicle.model}`.trim() : '',
    providerVerified: false,
    recordLabel: record.paymentType === 'Refund'
      ? 'Manually recorded refund. No bank or gateway returned this money.'
      : record.manual
        ? 'Manually recorded payment. This is an office record, not provider verification.'
        : PROVIDER_METHODS.includes(record.paymentMethod)
          ? 'Shown from sample records. The payment provider has not verified this charge.'
          : '',
  }
}

function syncBookingPaymentStatus(bookingId, payments) {
  const booking = bookingsById().get(bookingId)
  if (!booking) return
  const money = bookingMoney(booking, payments)
  let paymentStatus = 'Pending'
  if (money.netPaid >= money.total && money.total > 0) paymentStatus = 'Paid'
  else if (money.refunded > 0 && money.netPaid <= 0) paymentStatus = 'Refunded'
  updateBooking(bookingId, { paymentStatus })
}

function matchesSearch(payment, search) {
  if (!search) return true
  return [payment.transactionReference, payment.bookingReference, payment.customerName, payment.customerEmail]
    .join(' ')
    .toLowerCase()
    .includes(search)
}

export function listPaymentBookings() {
  return listAdminBookings()
}

export async function getPayments(params = {}) {
  await delay()
  const payments = ensurePayments()
  const bookings = bookingsById()
  const rows = payments.map((payment) => present(payment, bookings, payments))
  const search = String(params.search || '').trim().toLowerCase()
  const filtered = rows.filter((payment) => {
    if (!matchesSearch(payment, search)) return false
    if (params.status && payment.status !== params.status) return false
    if (params.method && payment.paymentMethod !== params.method) return false
    if (params.type && payment.paymentType !== params.type) return false
    const day = (payment.paidAt || payment.createdAt || '').slice(0, 10)
    if (params.dateFrom && day < params.dateFrom) return false
    if (params.dateTo && day > params.dateTo) return false
    return true
  })
  const sort = params.sort || 'newest'
  filtered.sort((left, right) => {
    if (sort === 'oldest') return left.createdAt.localeCompare(right.createdAt)
    if (sort === 'amount-asc') return left.amount - right.amount
    if (sort === 'amount-desc') return right.amount - left.amount
    return right.createdAt.localeCompare(left.createdAt)
  })
  const pageSize = params.pageSize || 4
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(Number(params.page) || 1, 1), pageCount)
  const start = (page - 1) * pageSize
  return {
    payments: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageCount,
    pageSize,
    stats: paymentStats(payments),
  }
}

export async function getPaymentStats() {
  await delay(60)
  return paymentStats(ensurePayments())
}

export async function getPaymentById(id) {
  await delay(80)
  const payments = ensurePayments()
  const record = payments.find((item) => item.id === id)
  if (!record) return null
  return present(record, bookingsById(), payments)
}

export async function getPaymentsByBookingId(bookingId) {
  await delay(60)
  const payments = ensurePayments().filter((item) => item.bookingId === bookingId)
  const bookings = bookingsById()
  return payments.map((payment) => present(payment, bookings, ensurePayments()))
}

export async function createManualPayment(paymentData) {
  await delay()
  const payments = ensurePayments()
  const booking = bookingsById().get(paymentData.bookingId)
  if (!booking) throw new PaymentError('Choose a booking that exists.')
  const amount = Number(paymentData.amount)
  if (!Number.isFinite(amount) || amount <= 0) throw new PaymentError('Amount must be greater than zero.')
  if (paymentData.currency !== 'USD') throw new PaymentError('Currency must be USD.')
  if (!chargeTypes.includes(paymentData.paymentType)) throw new PaymentError('Choose a valid payment type.')
  if (!paymentMethods.includes(paymentData.paymentMethod)) throw new PaymentError('Choose a valid payment method.')
  const money = bookingMoney(booking, payments)
  if (amount > money.outstanding) {
    throw new PaymentError(`Amount cannot exceed the outstanding balance of ${money.outstanding} USD.`)
  }
  const reference = String(paymentData.transactionReference || '').trim() || nextReference(payments)
  if (payments.some((item) => item.transactionReference === reference || item.id === reference)) {
    throw new PaymentError('That transaction reference is already in use.')
  }
  const now = new Date().toISOString()
  const record = {
    id: reference,
    transactionReference: reference,
    bookingReference: booking.bookingReference,
    bookingId: booking.id,
    amount,
    currency: 'USD',
    paymentMethod: paymentData.paymentMethod,
    paymentType: paymentData.paymentType,
    status: 'Paid',
    createdAt: now,
    paidAt: now,
    notes: String(paymentData.notes || '').trim(),
    manual: true,
    parentPaymentId: null,
  }
  const next = [record, ...payments]
  writePayments(next)
  syncBookingPaymentStatus(booking.id, next)
  return present(record, bookingsById(), next)
}

export async function settlePendingPayment(paymentId, notes = '') {
  await delay()
  const payments = ensurePayments()
  const current = payments.find((item) => item.id === paymentId)
  if (!current) throw new PaymentError('This payment could not be found.')
  if (current.paymentType === 'Refund' || current.status !== 'Pending') {
    throw new PaymentError('Only a pending payment can be recorded as received.')
  }
  const now = new Date().toISOString()
  const note = String(notes || '').trim()
  const updated = {
    ...current,
    status: 'Paid',
    paidAt: now,
    manual: true,
    notes: [current.notes, note, 'Manually recorded. Not verified by the payment provider.'].filter(Boolean).join(' '),
  }
  const next = payments.map((item) => (item.id === paymentId ? updated : item))
  writePayments(next)
  syncBookingPaymentStatus(current.bookingId, next)
  return present(updated, bookingsById(), next)
}

export async function recordRefund(paymentId, refundData) {
  await delay()
  const payments = ensurePayments()
  const current = payments.find((item) => item.id === paymentId)
  if (!current) throw new PaymentError('This payment could not be found.')
  if (current.paymentType === 'Refund' || !['Paid', 'Partially Refunded'].includes(current.status)) {
    throw new PaymentError('This payment cannot be refunded.')
  }
  const amount = Number(refundData.amount)
  if (!Number.isFinite(amount) || amount <= 0) throw new PaymentError('Refund amount must be greater than zero.')
  const remaining = refundableBalance(current, payments)
  if (amount > remaining) throw new PaymentError(`Refund cannot exceed the remaining ${remaining} USD.`)
  const reference = String(refundData.refundReference || '').trim() || nextReference(payments)
  if (payments.some((item) => item.transactionReference === reference || item.id === reference)) {
    throw new PaymentError('That refund reference is already in use.')
  }
  const now = new Date().toISOString()
  const refund = {
    id: reference,
    transactionReference: reference,
    bookingReference: current.bookingReference,
    bookingId: current.bookingId,
    amount,
    currency: current.currency || 'USD',
    paymentMethod: current.paymentMethod,
    paymentType: 'Refund',
    status: 'Refunded',
    createdAt: now,
    paidAt: now,
    notes: String(refundData.notes || '').trim(),
    reason: String(refundData.reason || '').trim(),
    manual: true,
    simulated: true,
    parentPaymentId: current.id,
  }
  const nextStatus = amount === remaining ? 'Refunded' : 'Partially Refunded'
  const next = [{ ...current, status: nextStatus }, ...payments.filter((item) => item.id !== current.id)]
  next.unshift(refund)
  writePayments(next)
  syncBookingPaymentStatus(current.bookingId, next)
  return present(refund, bookingsById(), next)
}

export { paymentStatuses as statuses }
