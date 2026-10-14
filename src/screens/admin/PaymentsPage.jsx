import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { PaymentFilters } from '@/components/admin/payments/PaymentFilters'
import { PaymentMobileCards } from '@/components/admin/payments/PaymentMobileCards'
import { PaymentSearch } from '@/components/admin/payments/PaymentSearch'
import { PaymentSort } from '@/components/admin/payments/PaymentSort'
import { PaymentStats } from '@/components/admin/payments/PaymentStats'
import { PaymentTable } from '@/components/admin/payments/PaymentTable'
import { RecordPaymentDialog } from '@/components/admin/payments/RecordPaymentDialog'
import { RecordRefundDialog } from '@/components/admin/payments/RecordRefundDialog'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { listAdminBookings } from '@/services/bookingService'
import {
  PaymentError,
  createManualPayment,
  getPayments,
  recordRefund,
  settlePendingPayment,
} from '@/services/paymentService'

const emptyFilters = { status: '', method: '', type: '', dateFrom: '', dateTo: '', sort: 'newest' }
const NOTICE_KEY = 'city-rental-car.payment-notice'

export default function PaymentsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [bookings, setBookings] = useState([])
  const [recordTarget, setRecordTarget] = useState(null)
  const [recordOpen, setRecordOpen] = useState(false)
  const [refundTarget, setRefundTarget] = useState(null)
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load(nextPage = page) {
    setError('')
    try {
      const data = await getPayments({ search, ...filters, page: nextPage })
      setResult(data)
      setPage(data.page)
      setBookings(listAdminBookings())
    } catch (loadError) {
      setError(loadError.message || 'Payments could not be loaded.')
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(NOTICE_KEY)
    if (stored) {
      setNotice(stored)
      sessionStorage.removeItem(NOTICE_KEY)
    }
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters])

  const activeCount = [filters.status, filters.method, filters.type, filters.dateFrom, filters.dateTo].filter(Boolean).length

  async function handleCreate(values) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = await createManualPayment(values)
      setRecordOpen(false)
      setNotice(`Manual payment ${saved.transactionReference} was recorded. It is not provider-verified.`)
      await load(1)
    } catch (saveError) {
      setDialogError(saveError instanceof PaymentError ? saveError.message : 'The payment could not be recorded.')
    } finally {
      setSaving(false)
    }
  }

  async function handleSettle(id, notes) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = await settlePendingPayment(id, notes)
      setRecordOpen(false)
      setNotice(`${saved.transactionReference} was marked paid from the office. The provider did not verify it.`)
      await load(page)
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
      const saved = await recordRefund(refundTarget.id, values)
      setRefundTarget(null)
      setNotice(`Simulated refund ${saved.transactionReference} was recorded. No money was sent to a bank or gateway.`)
      await load(1)
    } catch (saveError) {
      setDialogError(saveError instanceof PaymentError ? saveError.message : 'The refund could not be recorded.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">Payments Management</h1>
          <p className="mt-1 max-w-2xl text-small text-muted">
            Review sample charges, record office payments, and keep refunds separate from the original transaction.
          </p>
        </div>
        <Button
          onClick={() => {
            setRecordTarget(null)
            setDialogError('')
            setRecordOpen(true)
          }}
        >
          Record payment
        </Button>
      </div>
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      <PaymentStats stats={result?.stats} />
      <PaymentSearch value={search} onChange={setSearch} resultCount={result?.total ?? 0} />
      <PaymentFilters
        filters={filters}
        activeCount={activeCount}
        onChange={(next) => {
          setPage(1)
          setFilters(next)
        }}
        onReset={() => setFilters(emptyFilters)}
      />
      <PaymentSort
        value={filters.sort}
        onChange={(sort) => {
          setPage(1)
          setFilters((current) => ({ ...current, sort }))
        }}
      />
      {error ? <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger">{error}</p> : null}
      {!error && result && result.payments.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-small text-muted">No payments match these filters.</p>
      ) : null}
      {result?.payments?.length ? (
        <>
          <PaymentTable
            payments={result.payments}
            onView={(payment) => navigate(routes.admin.payment(payment.id))}
            onRecord={(payment) => {
              setRecordTarget(payment)
              setDialogError('')
              setRecordOpen(true)
            }}
            onRefund={(payment) => {
              setDialogError('')
              setRefundTarget(payment)
            }}
          />
          <PaymentMobileCards
            payments={result.payments}
            onView={(payment) => navigate(routes.admin.payment(payment.id))}
            onRecord={(payment) => {
              setRecordTarget(payment)
              setDialogError('')
              setRecordOpen(true)
            }}
            onRefund={(payment) => {
              setDialogError('')
              setRefundTarget(payment)
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-caption text-muted">
              Page {result.page} of {result.pageCount}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={result.page <= 1} onClick={() => load(result.page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={result.page >= result.pageCount} onClick={() => load(result.page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
      <RecordPaymentDialog
        open={recordOpen}
        payment={recordTarget}
        bookings={bookings}
        error={dialogError}
        loading={saving}
        onClose={() => setRecordOpen(false)}
        onCreate={handleCreate}
        onSettle={handleSettle}
      />
      <RecordRefundDialog
        open={Boolean(refundTarget)}
        payment={refundTarget}
        error={dialogError}
        loading={saving}
        onClose={() => setRefundTarget(null)}
        onSubmit={handleRefund}
      />
    </div>
  )
}
