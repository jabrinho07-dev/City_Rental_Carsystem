import { CarFront } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { bookingStatusView, formatMediumDate } from '@/utils/customerFormat'

export function ActiveRentalCard({ booking }) {
  if (!booking) {
    return (
      <CustomerEmptyState
        icon={CarFront}
        title="No Active Rental"
        message="Your active rentals will appear here."
        actionLabel="Browse Cars"
        actionTo={routes.cars}
      />
    )
  }

  const status = bookingStatusView(booking.status)

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid sm:grid-cols-[9rem_minmax(0,1fr)]">
        {booking.image ? (
          <img src={booking.image} alt="" className="h-36 w-full object-cover sm:h-full" />
        ) : (
          <div className="h-36 bg-canvas sm:h-full" />
        )}
        <div className="min-w-0 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">Active Rental</p>
              <h2 className="text-h3 mt-1 text-foreground">{booking.vehicleName}</h2>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <dl className="mt-4 grid gap-3 text-small sm:grid-cols-2">
            <div>
              <dt className="text-muted">Pickup</dt>
              <dd className="font-medium text-foreground">{booking.pickupLocation}</dd>
            </div>
            <div>
              <dt className="text-muted">Date</dt>
              <dd className="font-medium text-foreground">{formatMediumDate(booking.pickupDate)}</dd>
            </div>
            <div>
              <dt className="text-muted">Return</dt>
              <dd className="font-medium text-foreground">{formatMediumDate(booking.returnDate)}</dd>
            </div>
            <div>
              <dt className="text-muted">Booking Reference</dt>
              <dd className="font-medium text-foreground">{booking.id}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button to={routes.customer.booking(booking.id)} size="sm">
              View Details
            </Button>
            <Button to={routes.contact} size="sm" variant="outline">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
