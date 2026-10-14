import { useEffect, useState } from 'react'
import { useParams } from '@/lib/router'
import { BookingCancelDialog } from '@/components/admin/bookings/BookingCancelDialog'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/admin/bookings/BookingStatusBadge'
import { BookingStatusDialog } from '@/components/admin/bookings/BookingStatusDialog'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { allowedTransitions, BookingError, cancelBooking, getBookingById, updateBookingStatus } from '@/services/bookingService'
import { formatClock, formatMediumDate, formatMoney } from '@/utils/customerFormat'

function Fact({ label, value }) {
  return (
    <div>
      <dt className="text-caption text-muted">{label}</dt>
      <dd className="mt-1 text-small font-medium break-words text-foreground">{value || '—'}</dd>
    </div>
  )
}

export default function BookingDetailsPage() {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [missing, setMissing] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [statusOpen, setStatusOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function load() {
    try {
      setBooking(await getBookingById(id))
      setMissing(false)
    } catch {
      setMissing(true)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  async function confirmStatus(nextStatus) {
    setSaving(true)
    setError('')
    try {
      const next = await updateBookingStatus(id, nextStatus)
      setBooking(next)
      setNotice(`${next.bookingReference} is now ${nextStatus}.`)
      setStatusOpen(false)
    } catch (statusError) {
      setError(statusError instanceof BookingError ? statusError.message : 'The status could not be changed.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmCancel(reason) {
    setSaving(true)
    setError('')
    try {
      const next = await cancelBooking(id, reason)
      setBooking(next)
      setNotice(`${next.bookingReference} was cancelled.`)
      setCancelOpen(false)
    } catch (cancelError) {
      setError(cancelError instanceof BookingError ? cancelError.message : 'The booking could not be cancelled.')
    } finally {
      setSaving(false)
    }
  }

  if (missing) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <h2 className="text-h3 text-foreground">Booking not found</h2>
        <p className="mt-2 text-small text-muted">No reservation matches this link.</p>
        <Button className="mt-5" to={routes.admin.bookings}>
          Back to bookings
        </Button>
      </div>
    )
  }

  if (!booking) return <p className="text-small text-muted">Loading booking...</p>

  const transitions = allowedTransitions(booking.status)
  const vehicleName = [booking.vehicle.brand, booking.vehicle.model].filter(Boolean).join(' ')
  const created = booking.createdAt ? formatMediumDate(booking.createdAt.slice(0, 10)) : '—'

  return (
    <div className="space-y-4">
      {notice ? (
        <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-small font-medium text-success" role="status">
          {notice}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BookingStatusBadge status={booking.status} />
        <Button to={routes.admin.bookings} variant="outline" size="sm">
          Back to list
        </Button>
      </div>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Booking information</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Fact label="Reference" value={booking.bookingReference} />
          <Fact label="Created" value={created} />
          <Fact label="Pickup" value={`${formatMediumDate(booking.pickupDate)} · ${formatClock(booking.pickupTime)}`} />
          <Fact label="Return" value={`${formatMediumDate(booking.returnDate)} · ${formatClock(booking.returnTime)}`} />
          <Fact label="Pickup location" value={booking.pickupLocation} />
          <Fact label="Drop-off location" value={booking.dropoffLocation} />
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Customer</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <Fact label="Name" value={booking.customer.name} />
          <Fact label="Email" value={booking.customer.email} />
          <Fact label="Phone" value={booking.customer.phone} />
        </dl>
      </section>

      <section className="grid gap-4 rounded-lg border border-border bg-surface p-5 shadow-card sm:grid-cols-[8rem_minmax(0,1fr)]">
        {booking.vehicle.image ? <img src={booking.vehicle.image} alt="" className="h-28 w-full rounded-md object-cover" /> : <div className="grid h-28 place-items-center rounded-md bg-canvas text-caption text-muted">No photo</div>}
        <div>
          <h2 className="text-h3 text-foreground">Vehicle</h2>
          <p className="mt-2 text-small text-foreground">
            {vehicleName} {booking.vehicle.year ? `· ${booking.vehicle.year}` : ''}
          </p>
          <p className="mt-1 text-small text-muted">{booking.vehicle.id}</p>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Saved price</h2>
        <p className="mt-1 text-caption text-muted">This is the total stored with the booking. It is not recalculated from today’s rates.</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Fact label="Duration" value={`${booking.pricing.rentalDays || 0} day${booking.pricing.rentalDays === 1 ? '' : 's'}`} />
          <Fact label="Daily rate used" value={formatMoney(booking.pricing.dailyRate)} />
          <Fact label="Base charge" value={booking.pricing.base === null ? '—' : formatMoney(booking.pricing.base)} />
          <Fact label="Extras" value={formatMoney(booking.pricing.extrasTotal)} />
          <Fact label="Discount" value={formatMoney(booking.pricing.discount)} />
          <Fact label="Total" value={formatMoney(booking.pricing.total)} />
        </dl>
        {booking.extras.length ? (
          <ul className="mt-4 space-y-1 text-small text-muted">
            {booking.extras.map((extra) => (
              <li key={extra.id}>{extra.name}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Payment</h2>
        <div className="mt-3">
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Fact label="Payment reference" value={booking.paymentReference} />
          <Fact label="Amount recorded as paid" value={formatMoney(booking.amountPaid)} />
          <Fact label="Outstanding" value={formatMoney(booking.outstanding)} />
        </dl>
        {booking.paymentStatus !== 'Paid' ? <p className="mt-3 text-caption text-muted">Changing the booking status does not mark this payment as paid.</p> : null}
      </section>

      {transitions.length ? (
        <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="text-h3 text-foreground">Actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {transitions.filter((status) => status !== 'Cancelled').length ? (
              <Button
                onClick={() => {
                  setError('')
                  setStatusOpen(true)
                }}
              >
                Update status
              </Button>
            ) : null}
            {transitions.includes('Cancelled') ? (
              <Button
                variant="danger"
                onClick={() => {
                  setError('')
                  setCancelOpen(true)
                }}
              >
                Cancel booking
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}

      <BookingStatusDialog booking={statusOpen ? booking : null} loading={saving} error={error} onClose={() => setStatusOpen(false)} onConfirm={confirmStatus} />
      <BookingCancelDialog booking={cancelOpen ? booking : null} loading={saving} error={error} onClose={() => setCancelOpen(false)} onConfirm={confirmCancel} />
    </div>
  )
}
