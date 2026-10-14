const COLLECTED_STATUSES = ['Paid', 'Partially Refunded', 'Refunded']

export function isRefund(payment) {
  return payment?.paymentType === 'Refund'
}

export function isCollectedCharge(payment) {
  return !isRefund(payment) && COLLECTED_STATUSES.includes(payment?.status)
}

export function collectedGross(payments = []) {
  return payments.filter(isCollectedCharge).reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
}

export function refundedTotal(payments = []) {
  return payments.filter(isRefund).reduce((sum, payment) => sum + Number(payment.amount || 0), 0)
}

export function netCollected(payments = []) {
  return collectedGross(payments) - refundedTotal(payments)
}

export function refundsFor(payments, paymentId) {
  return payments.filter((payment) => isRefund(payment) && payment.parentPaymentId === paymentId)
}

export function refundedAmountFor(payments, paymentId) {
  return refundedTotal(refundsFor(payments, paymentId))
}

export function refundableBalance(payment, payments) {
  if (!payment || isRefund(payment)) return 0
  if (!['Paid', 'Partially Refunded'].includes(payment.status)) return 0
  return Math.max(0, Number(payment.amount || 0) - refundedAmountFor(payments, payment.id))
}

export function bookingMoney(booking, payments = []) {
  const related = payments.filter((payment) => payment.bookingId === booking?.id)
  const total = Number(booking?.pricing?.total ?? booking?.amount ?? 0)
  const paid = netCollected(related)
  const refunded = refundedTotal(related)
  const closed = booking?.status === 'Cancelled' || booking?.status === 'Rejected'
  return {
    total,
    grossPaid: collectedGross(related),
    refunded,
    netPaid: paid,
    outstanding: closed ? 0 : Math.max(0, total - paid),
  }
}

export function paymentStats(payments = []) {
  const charges = payments.filter((payment) => !isRefund(payment))
  return {
    totalRecords: payments.length,
    chargeCount: charges.length,
    refundCount: payments.length - charges.length,
    grossPaid: collectedGross(payments),
    netCollected: netCollected(payments),
    pendingCount: charges.filter((payment) => payment.status === 'Pending').length,
    pendingAmount: charges.filter((payment) => payment.status === 'Pending').reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    failedCount: charges.filter((payment) => payment.status === 'Failed').length,
    failedAmount: charges.filter((payment) => payment.status === 'Failed').reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    refundedAmount: refundedTotal(payments),
    currency: 'USD',
  }
}
