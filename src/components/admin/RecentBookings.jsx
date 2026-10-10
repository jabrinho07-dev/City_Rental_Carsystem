import { Link } from '@/lib/router'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { bookingStatusView, formatMoney, formatShortDate } from '@/utils/customerFormat'
import { CalendarCheck } from 'lucide-react'

const statusVariant = {
  Confirmed: 'confirmed',
  Active: 'available',
  Pending: 'pending',
  Completed: 'completed',
  Cancelled: 'cancelled',
  Reserved: 'reserved',
}

function ViewLink({ id }) {
  return (
    <Link
      to={routes.admin.bookings}
      className="text-small font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={`View booking ${id}`}
    >
      View
    </Link>
  )
}

export function RecentBookings({ bookings = [] }) {
  return (
    <section>
      <h2 className="text-h3 mb-3 text-foreground">Recent Bookings</h2>
      {bookings.length === 0 ? (
        <AdminEmptyState icon={CalendarCheck} title="No bookings" message="Recent reservations will appear here." />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 lg:block">
            <table className="w-full text-left text-small">
              <thead className="bg-canvas text-caption tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Booking ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Vehicle</th>
                  <th className="px-4 py-3 font-semibold">Pickup</th>
                  <th className="px-4 py-3 font-semibold">Return</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const status = bookingStatusView(booking.status)
                  return (
                    <tr key={booking.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{booking.id}</td>
                      <td className="px-4 py-3">{booking.customer}</td>
                      <td className="px-4 py-3">{booking.vehicle}</td>
                      <td className="px-4 py-3">{formatShortDate(booking.pickupDate)}</td>
                      <td className="px-4 py-3">{formatShortDate(booking.returnDate)}</td>
                      <td className="px-4 py-3">{formatMoney(booking.amount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusVariant[booking.status] || status.variant}>{booking.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ViewLink id={booking.id} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
          <ul className="space-y-3 lg:hidden">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <Card className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-caption font-semibold text-accent">{booking.id}</p>
                      <p className="mt-1 font-semibold">{booking.customer}</p>
                      <p className="text-small text-muted">{booking.vehicle}</p>
                    </div>
                    <Badge variant={statusVariant[booking.status] || 'pending'}>{booking.status}</Badge>
                  </div>
                  <p className="text-small text-muted">
                    {formatShortDate(booking.pickupDate)} – {formatShortDate(booking.returnDate)}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{formatMoney(booking.amount)}</p>
                    <ViewLink id={booking.id} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-4">
        <Button to={routes.admin.bookings} variant="outline" size="sm">
          View All Bookings
        </Button>
      </div>
    </section>
  )
}
