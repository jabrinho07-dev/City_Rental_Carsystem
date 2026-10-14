const tones = {
  Pending: 'bg-warning/15 text-warning',
  Confirmed: 'bg-success/10 text-success',
  Active: 'bg-secondary/10 text-secondary',
  Completed: 'bg-primary/10 text-primary',
  Cancelled: 'bg-danger/10 text-danger',
  Rejected: 'bg-danger/15 text-danger',
}

export function BookingStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ${tones[status] || tones.Pending}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}

const paymentTones = {
  Paid: 'bg-success/10 text-success',
  Pending: 'bg-warning/15 text-warning',
  Failed: 'bg-danger/10 text-danger',
  Refunded: 'bg-primary/10 text-primary',
}

export function PaymentStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold ${paymentTones[status] || paymentTones.Pending}`}>
      {status || 'Pending'}
    </span>
  )
}
