import { BookingActions } from '@/components/admin/bookings/BookingActions'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/admin/bookings/BookingStatusBadge'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'

export function BookingMobileCards({ bookings, onView, onStatus, onCancel }) {
  return (
    <div className="grid gap-3 lg:hidden">
      {bookings.map((booking) => (
        <article key={booking.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-h3 text-foreground">{booking.bookingReference}</h2>
              <p className="mt-1 text-small text-muted">{booking.customer.name}</p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="mt-3 text-small text-foreground">
            {booking.vehicle.brand} {booking.vehicle.model}
          </p>
          <p className="mt-1 text-small text-muted">
            {formatMediumDate(booking.pickupDate)} – {formatMediumDate(booking.returnDate)}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-small font-semibold text-foreground">{formatMoney(booking.pricing.total)}</p>
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
          <div className="mt-3">
            <BookingActions booking={booking} layout="grid" onView={onView} onStatus={onStatus} onCancel={onCancel} />
          </div>
        </article>
      ))}
    </div>
  )
}
