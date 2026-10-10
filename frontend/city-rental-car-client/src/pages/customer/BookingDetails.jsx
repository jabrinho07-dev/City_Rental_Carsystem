import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { cancelCustomerBooking, getBookingById } from '@/services/customerService'
import { calculateRentalDays, formatDuration } from '@/utils/bookingPrice'
import { bookingStatusView, formatClock, formatMediumDate, formatMoney, paymentStatusView } from '@/utils/customerFormat'
import { CalendarCheck } from 'lucide-react'

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-1 text-small font-medium break-words text-foreground">{value || '—'}</dd>
    </div>
  )
}

export default function BookingDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [booking, setBooking] = useState(null)
  const [ready, setReady] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [downloadNote, setDownloadNote] = useState('')

  useEffect(() => {
    let active = true
    setReady(false)
    getBookingById(id).then((next) => {
      if (!active) return
      setBooking(next)
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [id])

  if (!ready) return null

  if (!booking) {
    return (
      <CustomerEmptyState
        icon={CalendarCheck}
        title="Booking not found"
        message="This reference is not in the sample account or the current browser session."
        actionLabel="Back to My Bookings"
        actionTo={routes.customer.bookings}
      />
    )
  }

  const status = bookingStatusView(booking.status)
  const payment = paymentStatusView(booking.paymentStatus)
  const days = booking.pricing?.days || calculateRentalDays(booking.pickupDate, booking.returnDate)
  const customer = booking.customer || {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone,
    country: user?.country,
  }
  const canCancel = booking.status !== 'Cancelled' && booking.status !== 'Completed' && booking.status !== 'Rejected'

  async function confirmCancel() {
    const next = await cancelCustomerBooking(booking.id)
    setBooking(next)
    setConfirmingCancel(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body font-semibold text-foreground">{booking.id}</p>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <div className="grid sm:grid-cols-[11rem_minmax(0,1fr)]">
              {booking.image ? <img src={booking.image} alt="" className="h-40 w-full object-cover sm:h-full" /> : <div className="h-40 bg-canvas" />}
              <div className="p-5">
                <h2 className="text-h3 text-foreground">{booking.vehicleName}</h2>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Detail label="Pickup location" value={booking.pickupLocation} />
                  <Detail label="Drop-off location" value={booking.dropoffLocation} />
                  <Detail label="Pickup" value={`${formatMediumDate(booking.pickupDate)} · ${formatClock(booking.pickupTime)}`} />
                  <Detail label="Return" value={`${formatMediumDate(booking.returnDate)} · ${formatClock(booking.returnTime)}`} />
                  <Detail label="Rental duration" value={formatDuration(days)} />
                  <Detail label="Payment status" value={payment.label} />
                </dl>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-h3 text-foreground">Extras</h2>
            {booking.extras?.length ? (
              <ul className="mt-3 space-y-2 text-small">
                {booking.extras.map((extra) => (
                  <li key={extra.id || extra.name} className="flex justify-between gap-3">
                    <span>{extra.name}</span>
                    <span className="text-muted">{formatMoney(extra.pricePerDay)} / day</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-small text-muted">No extras selected.</p>
            )}
          </Card>

          <Card>
            <h2 className="text-h3 text-foreground">Customer information</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <Detail label="Name" value={`${customer.firstName || ''} ${customer.lastName || ''}`.trim()} />
              <Detail label="Email" value={customer.email} />
              <Detail label="Phone" value={customer.phone} />
              <Detail label="Country" value={customer.country} />
            </dl>
          </Card>
        </div>

        <Card>
          <h2 className="text-h3 text-foreground">Price breakdown</h2>
          <dl className="mt-4 space-y-3 text-small">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Base rental</dt>
              <dd>{formatMoney(booking.pricing?.base)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Extras</dt>
              <dd>{formatMoney(booking.pricing?.extrasTotal)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-border pt-3 font-semibold">
              <dt>Total</dt>
              <dd>{formatMoney(booking.amount)}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setDownloadNote('Invoice download will be available when billing is connected.')}
            >
              Download Invoice
            </Button>
            <Button to={routes.contact} variant="outline">
              Contact Support
            </Button>
            {canCancel ? (
              <Button variant="danger" onClick={() => setConfirmingCancel(true)}>
                Cancel Booking
              </Button>
            ) : null}
          </div>
          {downloadNote ? <p className="mt-3 text-caption text-muted">{downloadNote}</p> : null}
        </Card>
      </div>

      <Modal open={confirmingCancel} title="Cancel this booking?" onClose={() => setConfirmingCancel(false)}>
        <p className="text-small text-muted">
          This updates the booking status in the current browser session. It does not contact the rental desk.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setConfirmingCancel(false)}>
            Keep booking
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Cancel Booking
          </Button>
        </div>
      </Modal>
    </div>
  )
}
