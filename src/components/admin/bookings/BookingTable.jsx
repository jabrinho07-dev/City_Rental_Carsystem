import { BookingActions } from '@/components/admin/bookings/BookingActions'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/admin/bookings/BookingStatusBadge'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'

export function BookingTable({ bookings, onView, onStatus, onCancel }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface shadow-card lg:block">
      <table className="w-full min-w-[64rem] border-collapse text-left">
        <caption className="sr-only">Bookings</caption>
        <thead className="bg-canvas text-caption font-semibold tracking-wide text-muted uppercase">
          <tr>
            {['Reference', 'Customer', 'Vehicle', 'Pickup', 'Return', 'Total', 'Payment', 'Status', 'Created', 'Actions'].map((heading) => (
              <th key={heading} scope="col" className="px-3 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t border-border">
              <th scope="row" className="px-3 py-3 text-small font-semibold text-foreground">
                {booking.bookingReference}
              </th>
              <td className="px-3 py-3 text-small text-foreground">{booking.customer.name}</td>
              <td className="px-3 py-3 text-small text-foreground">
                {booking.vehicle.brand} {booking.vehicle.model}
              </td>
              <td className="px-3 py-3 text-small text-foreground">{formatMediumDate(booking.pickupDate)}</td>
              <td className="px-3 py-3 text-small text-foreground">{formatMediumDate(booking.returnDate)}</td>
              <td className="px-3 py-3 text-small font-semibold text-foreground">{formatMoney(booking.pricing.total)}</td>
              <td className="px-3 py-3">
                <PaymentStatusBadge status={booking.paymentStatus} />
              </td>
              <td className="px-3 py-3">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="px-3 py-3 text-small text-muted">{formatMediumDate(booking.createdAt.slice(0, 10))}</td>
              <td className="px-3 py-3">
                <BookingActions booking={booking} onView={onView} onStatus={onStatus} onCancel={onCancel} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
