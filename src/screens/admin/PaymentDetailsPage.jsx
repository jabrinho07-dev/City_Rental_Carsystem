import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from '@/lib/router'
import { PaymentStatusBadge } from '@/components/admin/payments/PaymentStatusBadge'
import { RecordPaymentDialog } from '@/components/admin/payments/RecordPaymentDialog'
import { RecordRefundDialog } from '@/components/admin/payments/RecordRefundDialog'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { listAdminBookings } from '@/services/bookingService'
import {
  PaymentError,
  createManualPayment,
  getPaymentById,
  recordRefund,
  settlePendingPayment,
} from '@/services/paymentService'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-border py-2 text-small">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}

export default function PaymentDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payment, setPayment] = useState(null)
  const [missing, setMissing] = useState(false)
  const [notice, setNotice] = useState('')
  const [bookings, setBookings] = useState([])
  const [recordOpen, setRecordOpen] = useState(false)
  const [refundOpen, setRefundOpen] = useState(false)
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const found = await getPaymentById(id)
    if (!found) {
      setMissing(true)
      setPayment(null)
      return
    }
    setMissing(false)
    setPayment(found)
    setBookings(listAdminBookings())
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleSettle(paymentId, notes) {
    setSaving(true)
    setDialogError('')
    try {
      await settlePendingPayment(paymentId, notes)
      setRecordOpen(false)
      setNotice('The pending payment was recorded as received in the office. The provider did not verify it.')
      await load()
    } catch (saveError) {
      setDialogError(saveError instanceof PaymentError ? saveError.message : 'The payment could not be recorded.')
    } finally {
      setSaving(false)
    }
  }

  async function handleCreate(values) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = await createManualPayment(values)
      setRecordOpen(false)
      setNotice(`Manual payment ${saved.transactionReference} was recorded.`)
      navigate(routes.admin.payment(saved.id))
    } catch (saveError) {
      setDialogError(saveError instanceof PaymentError ? saveError.message : 'The payment could not be recorded.')
    } finally {
      setSaving(false)
    }
  }

  async function handleRefund(values) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = await recordRefund(payment.id, values)
      setRefundOpen(false)
      setNotice('A simulated refund entry was added. The original payment is still on record.')
      navigate(routes.admin.payment(saved.id))
    } catch (saveError) {
      setDialogError(saveError instanceof PaymentError ? saveError.message : 'The refund could not be recorded.')
    } finally {
      setSaving(false)
    }
  }

  if (missing) {
    return (
      <div className="space-y-4">
        <h1 className="text-h2 text-foreground">Payment not found</h1>
        <p className="text-small text-muted">This payment id is not in the office records.</p>
        <Button to={routes.admin.payments}>Return to payment list</Button>
      </div>
    )
  }

  if (!payment) return <p className="text-small text-muted">Loading payment…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">{payment.transactionReference}</h1>
          <p className="mt-1 text-small text-muted">Office payment record for {payment.bookingReference}</p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      {payment.recordLabel ? <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-small text-foreground">{payment.recordLabel}</p> : null}
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Transaction details</h2>
        <dl>
          <Row label="Transaction reference" value={payment.transactionReference} />
          <Row label="Booking reference" value={payment.bookingReference} />
          <Row label="Payment date" value={formatMediumDate((payment.paidAt || payment.createdAt).slice(0, 10))} />
          <Row label="Payment method" value={payment.paymentMethod} />
          <Row label="Payment type" value={payment.paymentType} />
          <Row label="Current status" value={payment.status} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Customer details</h2>
        <dl>
          <Row label="Name" value={payment.customerName} />
          <Row label="Email" value={payment.customerEmail || '—'} />
          <Row label="Phone" value={payment.customerPhone || '—'} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Amount details</h2>
        <dl>
          <Row label="Original payment amount" value={`${formatMoney(payment.amount)} ${payment.currency}`} />
          <Row label="Refunded amount" value={`${formatMoney(payment.refundedAmount)} ${payment.currency}`} />
          <Row label="Net amount retained" value={`${formatMoney(payment.netRetained)} ${payment.currency}`} />
          <Row label="Currency" value={payment.currency} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Booking information</h2>
        {payment.bookingMissing ? (
          <p className="mt-2 text-small text-muted">The related booking is no longer available. This payment record was kept.</p>
        ) : (
          <dl>
            <Row
              label="Related booking"
              value={<Link to={routes.admin.booking(payment.bookingId)} className="text-accent underline">{payment.bookingReference}</Link>}
            />
            <Row label="Vehicle" value={payment.vehicleName || '—'} />
            <Row label="Booking status" value={payment.bookingStatus} />
            <Row label="Booking total" value={formatMoney(payment.bookingTotal)} />
            <Row label="Amount paid" value={formatMoney(payment.bookingPaid)} />
            <Row label="Outstanding balance" value={formatMoney(payment.bookingOutstanding)} />
          </dl>
        )}
      </section>
      {payment.reason ? <p className="text-small text-muted">Reason: {payment.reason}</p> : null}
      {payment.notes ? <p className="text-small text-muted">Notes: {payment.notes}</p> : null}
      <div className="flex flex-wrap gap-2">
        {payment.status === 'Pending' && payment.paymentType !== 'Refund' ? (
          <Button
            onClick={() => {
              setDialogError('')
              setRecordOpen(true)
            }}
          >
            Record payment
          </Button>
        ) : null}
        {payment.refundable > 0 ? (
          <Button
            variant="secondary"
            onClick={() => {
              setDialogError('')
              setRefundOpen(true)
            }}
          >
            Record refund
          </Button>
        ) : null}
        <Button variant="outline" to={routes.admin.payments}>
          Return to payment list
        </Button>
      </div>
      <RecordPaymentDialog
        open={recordOpen}
        payment={payment}
        bookings={bookings}
        error={dialogError}
        loading={saving}
        onClose={() => setRecordOpen(false)}
        onCreate={handleCreate}
        onSettle={handleSettle}
      />
      <RecordRefundDialog
        open={refundOpen}
        payment={payment}
        error={dialogError}
        loading={saving}
        onClose={() => setRefundOpen(false)}
        onSubmit={handleRefund}
      />
    </div>
  )
}
