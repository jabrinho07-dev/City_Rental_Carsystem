import { CircleCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { routes } from '@/constants/routes'
import { formatBookingDate } from '@/utils/generateBookingReference'

export function BookingSuccess({ booking }) {
  return (
    <Card className="mx-auto max-w-2xl">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className="grid size-14 place-items-center rounded-full bg-success/10 text-success">
          <CircleCheck size={32} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-h2 text-foreground">Booking Request Submitted</h1>
          <p className="mt-2 text-body text-muted">Your booking request has been successfully submitted.</p>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 text-small sm:grid-cols-2">
        <div>
          <dt className="text-muted">Booking Reference</dt>
          <dd className="mt-1 text-h3 text-foreground">{booking.id}</dd>
        </div>
        <div>
          <dt className="text-muted">Status</dt>
          <dd className="mt-1">
            <Badge variant="pending">Pending Confirmation</Badge>
          </dd>
        </div>
        <div>
          <dt className="text-muted">Vehicle</dt>
          <dd className="mt-1 font-semibold text-foreground">{booking.vehicleName}</dd>
        </div>
        <div>
          <dt className="text-muted">Total</dt>
          <dd className="mt-1 font-semibold text-foreground">{formatPricePerDay(booking.pricing.total)}</dd>
        </div>
        <div>
          <dt className="text-muted">Pickup</dt>
          <dd className="mt-1 text-foreground">{booking.pickupLocation}</dd>
        </div>
        <div>
          <dt className="text-muted">Drop-off</dt>
          <dd className="mt-1 text-foreground">{booking.dropoffLocation}</dd>
        </div>
        <div>
          <dt className="text-muted">Pickup Date</dt>
          <dd className="mt-1 text-foreground">{formatBookingDate(booking.pickupDate)}</dd>
        </div>
        <div>
          <dt className="text-muted">Return Date</dt>
          <dd className="mt-1 text-foreground">{formatBookingDate(booking.returnDate)}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-md border border-border bg-canvas p-4">
        <h2 className="text-small font-semibold text-foreground">Next steps</h2>
        <ul className="mt-2 space-y-1 text-small text-muted">
          <li>Your booking request is pending confirmation.</li>
          <li>You will receive an update once your booking is reviewed.</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button to={routes.customer.booking(booking.id)}>View My Booking</Button>
        <Button to={routes.cars} variant="outline">Browse More Cars</Button>
        <Button to={routes.home} variant="ghost">Back to Home</Button>
      </div>
    </Card>
  )
}
