import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from '@/lib/router'
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/admin/bookings/BookingStatusBadge'
import { CustomerEditDialog } from '@/components/admin/customers/CustomerEditDialog'
import { CustomerStatusBadge } from '@/components/admin/customers/CustomerStatusBadge'
import { CustomerStatusDialog } from '@/components/admin/customers/CustomerStatusDialog'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { CustomerError, getCustomerBookings, getCustomerById, getCustomerPayments, updateCustomer, updateCustomerStatus } from '@/services/customerService'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

function initials(name) {
  return name.split(' ').slice(0, 2).map((part) => part[0] || '').join('').toUpperCase() || 'CR'
}

export default function CustomerDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [bookings, setBookings] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    setMissing(false)
    try {
      const profile = await getCustomerById(id)
      if (!profile) {
        setCustomer(null)
        setMissing(true)
        return
      }
      const [history, ledger] = await Promise.all([getCustomerBookings(id), getCustomerPayments(id)])
      setCustomer(profile)
      setBookings(history)
      setPayments(ledger)
    } catch (loadError) {
      setError(loadError instanceof CustomerError ? loadError.message : 'The customer profile could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function saveProfile(values) {
    setSaving(true)
    setActionError('')
    try {
      await updateCustomer(id, values)
      setEditing(false)
      setNotice('Contact details saved in this browser.')
      await load()
    } catch (saveError) {
      setActionError(saveError instanceof CustomerError ? saveError.message : 'The customer could not be updated.')
    } finally {
      setSaving(false)
    }
  }

  async function saveStatus(status) {
    setSaving(true)
    setActionError('')
    try {
      await updateCustomerStatus(id, status)
      setStatusOpen(false)
      setNotice(`Account status is now ${status}. Bookings and payments were left unchanged.`)
      await load()
    } catch (statusError) {
      setActionError(statusError instanceof CustomerError ? statusError.message : 'The status could not be changed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-small text-muted">Loading customer...</p>
  if (missing) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface p-8">
        <h1 className="text-h2 text-foreground">Customer not found</h1>
        <p className="mt-2 text-small text-muted">No customer record matches this ID.</p>
        <Button className="mt-5" variant="outline" onClick={() => navigate(routes.admin.customers)}>Back to Customers</Button>
      </div>
    )
  }
  if (error || !customer) {
    return (
      <div className="rounded-lg border border-danger/30 bg-surface p-5">
        <p className="text-body text-danger">{error || 'The customer profile could not be loaded.'}</p>
        <Button className="mt-4" variant="outline" onClick={load}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Button variant="outline" size="sm" onClick={() => navigate(routes.admin.customers)}>Back to Customers</Button>
      {notice ? <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-small font-medium text-success" role="status">{notice}</p> : null}
      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {customer.profileImage ? (
              <img src={customer.profileImage} alt="" className="size-16 rounded-full object-cover" />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-primary text-body font-semibold text-white">{initials(customer.name)}</span>
            )}
            <div>
              <h1 className="text-h2 text-foreground">{customer.name}</h1>
              <p className="mt-1 text-small text-muted">{customer.email}</p>
              <p className="text-small text-muted">{customer.phone}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CustomerStatusBadge status={customer.status} />
                <span className="text-caption text-muted">Registered {customer.createdAt ? formatMediumDate(customer.createdAt) : 'date not recorded'}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => { setActionError(''); setEditing(true) }}>Edit details</Button>
            <Button variant="outline" onClick={() => { setActionError(''); setStatusOpen(true) }}>Change status</Button>
          </div>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="text-h3 text-foreground">Contact</h2>
          <dl className="mt-3 space-y-2 text-small">
            <div><dt className="text-muted">Address</dt><dd className="text-foreground">{[customer.address, customer.city, customer.country].filter(Boolean).join(', ') || 'Not recorded'}</dd></div>
            <div><dt className="text-muted">Customer ID</dt><dd className="text-foreground">{customer.id}</dd></div>
            <div><dt className="text-muted">Notes</dt><dd className="text-foreground">{customer.notes || 'No administrative notes.'}</dd></div>
          </dl>
        </article>
        <article className="rounded-lg border border-border bg-surface p-5 shadow-card">
          <h2 className="text-h3 text-foreground">Linked activity</h2>
          <p className="mt-1 text-caption text-muted">Counts use existing booking records. Collected amount uses linked payment records and is demo data.</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-small">
            <div><dt className="text-muted">Total bookings</dt><dd className="text-h3 text-foreground">{customer.totalBookings}</dd></div>
            <div><dt className="text-muted">Completed</dt><dd className="text-h3 text-foreground">{customer.completedBookings}</dd></div>
            <div><dt className="text-muted">Cancelled</dt><dd className="text-h3 text-foreground">{customer.cancelledBookings}</dd></div>
            <div><dt className="text-muted">Collected</dt><dd className="text-h3 text-foreground">{formatMaintenanceMoney(customer.totalSpent)}</dd></div>
          </dl>
        </article>
      </section>
      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Booking history</h2>
        {bookings.length === 0 ? <p className="mt-3 text-small text-muted">This customer has no linked bookings.</p> : (
          <ul className="mt-4 space-y-3">
            {bookings.map((booking) => (
              <li key={booking.id} className="rounded-md border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link className="text-small font-semibold text-primary underline-offset-2 hover:underline" to={routes.admin.booking(booking.id)}>{booking.bookingReference}</Link>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="mt-1 text-small text-foreground">{booking.vehicle.brand} {booking.vehicle.model}</p>
                <p className="text-caption text-muted">{formatMediumDate(booking.pickupDate)} to {formatMediumDate(booking.returnDate)} · {formatMoney(booking.pricing.total)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
        <h2 className="text-h3 text-foreground">Recent payments</h2>
        <p className="mt-1 text-caption text-muted">These are existing payment records for this customer’s bookings. They are office demo records, not live charges.</p>
        {payments.length === 0 ? <p className="mt-3 text-small text-muted">No payment records are linked to this customer.</p> : (
          <ul className="mt-4 space-y-3">
            {payments.slice(0, 8).map((payment) => (
              <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-3">
                <div>
                  <Link className="text-small font-semibold text-primary underline-offset-2 hover:underline" to={routes.admin.payment(payment.id)}>{payment.reference}</Link>
                  <p className="text-caption text-muted">{formatMediumDate(payment.date)} · {payment.method} · {payment.paymentType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-small font-semibold text-foreground">{formatMaintenanceMoney(payment.amount)}</span>
                  <PaymentStatusBadge status={payment.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <CustomerEditDialog customer={editing ? customer : null} loading={saving} error={actionError} onClose={() => setEditing(false)} onSave={saveProfile} />
      <CustomerStatusDialog key={statusOpen ? customer.status : 'closed'} customer={statusOpen ? customer : null} loading={saving} error={actionError} onClose={() => setStatusOpen(false)} onConfirm={saveStatus} />
    </div>
  )
}
