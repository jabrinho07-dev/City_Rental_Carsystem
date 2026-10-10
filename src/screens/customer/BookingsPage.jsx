import { Link } from '@/lib/router'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { listBookings } from '@/services/bookingService'
import { formatBookingDate } from '@/utils/generateBookingReference'

const statusView = {
  Pending: { label: 'Pending Confirmation', variant: 'pending' },
  Cancelled: { label: 'Cancelled', variant: 'cancelled' },
}

export default function BookingsPage() {
  const bookings = listBookings()

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-h2 text-foreground">My Bookings</h1>
        <p className="mt-2 text-small text-muted">Requests saved in this browser session.</p>
      </div>
      {bookings.length === 0 ? (
        <Card>
          <p className="text-body text-foreground">You have no booking requests yet.</p>
          <div className="mt-4">
            <Button to={routes.cars}>Browse Cars</Button>
          </div>
        </Card>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => {
            const status = statusView[booking.status] || { label: booking.status, variant: 'pending' }
            return (
              <li key={booking.id}>
                <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-caption font-semibold text-accent">{booking.id}</p>
                    <h2 className="mt-1 text-h3 break-words text-foreground">{booking.vehicleName}</h2>
                    <p className="mt-1 text-small text-muted">
                      {formatBookingDate(booking.pickupDate)} – {formatBookingDate(booking.returnDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={status.variant}>{status.label}</Badge>
                    <Link
                      to={routes.customer.booking(booking.id)}
                      className="text-small font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      View
                    </Link>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
