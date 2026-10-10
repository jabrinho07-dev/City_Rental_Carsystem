import { useState } from 'react'
import { useParams } from '@/lib/router'
import { BookingPriceSummary } from '@/components/booking/BookingPriceSummary'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { routes } from '@/constants/routes'
import { getBooking, getBookingVehicle, updateBooking } from '@/services/bookingService'
import { formatBookingDate } from '@/utils/generateBookingReference'

const statusView = {
  Pending: { label: 'Pending Confirmation', variant: 'pending' },
  Confirmed: { label: 'Confirmed', variant: 'confirmed' },
  Active: { label: 'Active', variant: 'available' },
  Completed: { label: 'Completed', variant: 'completed' },
  Cancelled: { label: 'Cancelled', variant: 'cancelled' },
  Rejected: { label: 'Rejected', variant: 'cancelled' },
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-1 text-small font-medium break-words text-foreground">{value || '—'}</dd>
    </div>
  )
}

export default function BookingDetailsPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState(() => getBooking(id))
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const vehicle = getBookingVehicle(booking)
  const status = statusView[booking?.status] || statusView.Pending

  if (!booking) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="text-h2 text-foreground">Booking not found</h1>
        <p className="mt-3 text-body text-muted">This booking is not saved in the current browser session.</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button to={routes.customer.bookings}>Back to My Bookings</Button>
          <Button to={routes.cars} variant="outline">Browse Cars</Button>
        </div>
      </Card>
    )
  }

  function cancelBooking() {
    const next = updateBooking(booking.id, { status: 'Cancelled' })
    setBooking(next)
    setConfirmingCancel(false)
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">Booking</p>
          <h1 className="text-h2 mt-1 text-foreground">{booking.id}</h1>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <Card>
            <h2 className="text-h3 text-foreground">Vehicle</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail label="Vehicle" value={booking.vehicleName || (vehicle ? `${vehicle.brand} ${vehicle.model}` : booking.vehicleId)} />
              <Detail label="Category" value={vehicle?.category} />
              <Detail label="Daily rate" value={vehicle ? `${formatPricePerDay(vehicle.pricePerDay)} / day` : null} />
              <Detail label="Availability at request" value={vehicle?.availability} />
            </dl>
          </Card>
          <Card>
            <h2 className="text-h3 text-foreground">Rental</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail label="Pickup" value={`${booking.pickupLocation} · ${formatBookingDate(booking.pickupDate)} · ${booking.pickupTime}`} />
              <Detail label="Drop-off" value={`${booking.dropoffLocation} · ${formatBookingDate(booking.returnDate)} · ${booking.returnTime}`} />
            </dl>
          </Card>
          <Card>
            <h2 className="text-h3 text-foreground">Customer</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={`${booking.customer.firstName} ${booking.customer.lastName}`} />
              <Detail label="Email" value={booking.customer.email} />
              <Detail label="Phone" value={booking.customer.phone} />
              <Detail label="Country" value={booking.customer.country} />
              <Detail label="Driving license" value={booking.customer.licenseNumber} />
              <Detail label="Notes" value={booking.customer.notes} />
            </dl>
          </Card>
          <Card>
            <h2 className="text-h3 text-foreground">Extras</h2>
            {booking.extras.length > 0 ? (
              <ul className="mt-3 space-y-2 text-small text-foreground">
                {booking.extras.map((extra) => (
                  <li key={extra.id}>
                    {extra.name} · {formatPricePerDay(extra.pricePerDay)}/day
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-small text-muted">No extras selected.</p>
            )}
          </Card>
          <Card>
            <h2 className="text-h3 text-foreground">Terms</h2>
            <p className="mt-3 text-small text-muted">
              {booking.acceptedTerms ? 'The rental terms and conditions were accepted with this request.' : 'Terms were not recorded.'}
            </p>
          </Card>
        </div>
        <BookingPriceSummary pricing={booking.pricing} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button to={routes.customer.bookings} variant="outline">
          Back to My Bookings
        </Button>
        {booking.status !== 'Cancelled' ? (
          <Button type="button" variant="danger" onClick={() => setConfirmingCancel(true)}>
            Cancel Booking
          </Button>
        ) : null}
      </div>

      <Modal open={confirmingCancel} title="Cancel booking" onClose={() => setConfirmingCancel(false)}>
        <p className="text-foreground">Are you sure you want to cancel this booking?</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={() => setConfirmingCancel(false)}>
            Keep Booking
          </Button>
          <Button type="button" variant="danger" onClick={cancelBooking}>
            Cancel Booking
          </Button>
        </div>
      </Modal>
    </div>
  )
}
