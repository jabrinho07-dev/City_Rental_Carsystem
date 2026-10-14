import { mockPayments } from '@/constants/mockCustomerData'

const STORAGE_KEY = 'city-rental-car.payments'

const METHODS = ['Cash', 'EVC Plus', 'Zaad', 'Hormuud', 'Visa', 'Mastercard', 'Bank Transfer', 'Other']

function normalizeMethod(method) {
  if (method === 'Card') return 'Visa'
  return METHODS.includes(method) ? method : 'Other'
}

function seedRecord(payment) {
  const refunded = payment.status === 'Refunded'
  const charge = {
    id: payment.id,
    transactionReference: payment.id,
    bookingReference: payment.bookingId,
    bookingId: payment.bookingId,
    amount: Number(payment.amount || 0),
    currency: 'USD',
    paymentMethod: normalizeMethod(payment.method),
    paymentType: 'Full Payment',
    status: payment.status,
    createdAt: `${payment.date}T09:00:00.000Z`,
    paidAt: payment.status === 'Paid' || refunded ? `${payment.date}T09:00:00.000Z` : null,
    notes: '',
    manual: false,
    parentPaymentId: null,
  }
  if (!refunded) return [charge]
  return [
    charge,
    {
      id: `${payment.id}-R`,
      transactionReference: `${payment.id}-R`,
      bookingReference: payment.bookingId,
      bookingId: payment.bookingId,
      amount: Number(payment.amount || 0),
      currency: 'USD',
      paymentMethod: normalizeMethod(payment.method),
      paymentType: 'Refund',
      status: 'Refunded',
      createdAt: `${payment.date}T12:00:00.000Z`,
      paidAt: `${payment.date}T12:00:00.000Z`,
      notes: 'Seeded refund entry for the original mock payment. No bank return was performed.',
      manual: false,
      simulated: true,
      parentPaymentId: payment.id,
      reason: 'Seeded from the existing refunded mock payment.',
    },
  ]
}

export function readPayments() {
  if (typeof window === 'undefined') return mockPayments.flatMap(seedRecord)
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return ensurePayments()
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : ensurePayments()
  } catch {
    return ensurePayments()
  }
}

export function writePayments(payments) {
  if (typeof window === 'undefined') return payments
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payments))
  return payments
}

export function ensurePayments() {
  if (typeof window === 'undefined') return mockPayments.flatMap(seedRecord)
  const raw = window.sessionStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    } catch {
      /* reseed */
    }
  }
  return writePayments(mockPayments.flatMap(seedRecord))
}
