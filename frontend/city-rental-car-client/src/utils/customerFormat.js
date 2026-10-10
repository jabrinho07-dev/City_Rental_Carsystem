export function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function formatMediumDate(value) {
  if (!value) return '—'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(value) {
  if (!value) return '—'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatClock(value) {
  if (!value) return ''
  const [hour, minute] = value.split(':').map(Number)
  if (Number.isNaN(hour) || Number.isNaN(minute)) return value
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const bookingStatus = {
  Pending: { label: 'Pending', variant: 'pending' },
  Confirmed: { label: 'Confirmed', variant: 'confirmed' },
  Active: { label: 'Active', variant: 'available' },
  Completed: { label: 'Completed', variant: 'completed' },
  Cancelled: { label: 'Cancelled', variant: 'cancelled' },
  Rejected: { label: 'Rejected', variant: 'cancelled' },
}

const paymentStatus = {
  Paid: { label: 'Paid', variant: 'paid' },
  Pending: { label: 'Pending', variant: 'pending' },
  Failed: { label: 'Failed', variant: 'unpaid' },
  Refunded: { label: 'Refunded', variant: 'completed' },
}

export function bookingStatusView(status) {
  return bookingStatus[status] || { label: status || 'Unknown', variant: 'pending' }
}

export function paymentStatusView(status) {
  return paymentStatus[status] || { label: status || 'Unknown', variant: 'pending' }
}
