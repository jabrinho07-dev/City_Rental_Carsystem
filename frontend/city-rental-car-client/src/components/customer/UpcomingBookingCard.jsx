import { CalendarCheck } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { bookingStatusView, formatMediumDate } from '@/utils/customerFormat'

export function UpcomingBookingCard({ booking }) {
  if (!booking) {
    return (
      <CustomerEmptyState
        icon={CalendarCheck}
        title="No upcoming booking"
        message="Confirmed trips that have not started will appear here."
        actionLabel="Browse Cars"
        actionTo={routes.cars}
      />
    )
  }

  const status = bookingStatusView(booking.status)

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">Next booking</p>
          <h2 className="text-h3 mt-1 text-foreground">{booking.vehicleName}</h2>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      <dl className="mt-4 grid flex-1 gap-3 text-small">
        <div>
          <dt className="text-muted">Pickup</dt>
          <dd className="font-medium text-foreground">{booking.pickupLocation}</dd>
        </div>
        <div>
          <dt className="text-muted">Pickup Date</dt>
          <dd className="font-medium text-foreground">{formatMediumDate(booking.pickupDate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Return</dt>
          <dd className="font-medium text-foreground">{formatMediumDate(booking.returnDate)}</dd>
        </div>
      </dl>
      <div className="mt-5">
        <Button to={routes.customer.booking(booking.id)} size="sm" variant="outline">
          View Booking
        </Button>
      </div>
    </Card>
  )
}
