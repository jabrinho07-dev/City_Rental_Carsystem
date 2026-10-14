import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { BookingCancelDialog } from '@/components/admin/bookings/BookingCancelDialog'
import { BookingFilters } from '@/components/admin/bookings/BookingFilters'
import { BookingMobileCards } from '@/components/admin/bookings/BookingMobileCards'
import { BookingSearch } from '@/components/admin/bookings/BookingSearch'
import { BookingSort } from '@/components/admin/bookings/BookingSort'
import { BookingStats } from '@/components/admin/bookings/BookingStats'
import { BookingStatusDialog } from '@/components/admin/bookings/BookingStatusDialog'
import { BookingTable } from '@/components/admin/bookings/BookingTable'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { BookingError, cancelBooking, getBookings, updateBookingStatus } from '@/services/bookingService'

const initialFilters = { status: '', paymentStatus: '', category: '', pickupFrom: '', pickupTo: '', sort: 'newest' }
const categories = ['Economy', 'Sedan', 'SUV', 'Luxury', '4x4', 'Van']

export default function BookingsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [statusTarget, setStatusTarget] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  const active = [
    search ? `Search: ${search}` : '',
    filters.status,
    filters.paymentStatus,
    filters.category,
    filters.pickupFrom ? `From ${filters.pickupFrom}` : '',
    filters.pickupTo ? `To ${filters.pickupTo}` : '',
    filters.sort !== 'newest' ? 'Custom sort' : '',
  ].filter(Boolean)

  async function load(nextPage = page) {
    setLoading(true)
    setError('')
    try {
      const data = await getBookings({ search, ...filters, page: nextPage })
      setResult(data)
      setPage(data.page)
    } catch (loadError) {
      setError(loadError instanceof BookingError ? loadError.message : 'The booking list could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters, page])

  function changeFilter(key, value) {
    setPage(1)
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function resetFilters() {
    setSearch('')
    setFilters(initialFilters)
    setPage(1)
  }

  async function confirmStatus(nextStatus) {
    if (!statusTarget) return
    setSaving(true)
    setActionError('')
    try {
      await updateBookingStatus(statusTarget.id, nextStatus)
      setNotice(`${statusTarget.bookingReference} is now ${nextStatus}.`)
      setStatusTarget(null)
      await load(page)
    } catch (statusError) {
      setActionError(statusError instanceof BookingError ? statusError.message : 'The status could not be changed.')
    } finally {
      setSaving(false)
    }
  }

  async function confirmCancel(reason) {
    if (!cancelTarget) return
    setSaving(true)
    setActionError('')
    try {
      await cancelBooking(cancelTarget.id, reason)
      setNotice(`${cancelTarget.bookingReference} was cancelled.`)
      setCancelTarget(null)
      await load(page)
    } catch (cancelError) {
      setActionError(cancelError instanceof BookingError ? cancelError.message : 'The booking could not be cancelled.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-small text-muted">{result ? `${result.total} matching booking${result.total === 1 ? '' : 's'}` : 'Reservations'}</p>
      {notice ? (
        <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-small font-medium text-success" role="status">
          {notice}
        </p>
      ) : null}
      <BookingStats stats={result?.stats} />
      <section className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <BookingSearch
            value={search}
            onChange={(value) => {
              setPage(1)
              setSearch(value)
            }}
          />
          <BookingSort value={filters.sort} onChange={(value) => changeFilter('sort', value)} />
        </div>
        <BookingFilters filters={filters} categories={categories} onChange={changeFilter} />
        {active.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {active.map((item) => (
              <span key={item} className="rounded-full border border-border bg-canvas px-2.5 py-1 text-caption font-medium text-foreground">
                {item}
              </span>
            ))}
            <button type="button" className="rounded-md px-2 py-1 text-caption font-semibold text-primary hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        ) : null}
      </section>

      {loading ? <p className="text-small text-muted">Loading bookings...</p> : null}
      {error ? (
        <div className="rounded-lg border border-danger/30 bg-surface p-5">
          <p className="text-body text-danger">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => load(page)}>
            Try again
          </Button>
        </div>
      ) : null}
      {!loading && !error && result?.bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center">
          <h2 className="text-h3 text-foreground">No bookings match</h2>
          <p className="mx-auto mt-2 max-w-md text-small text-muted">Try another reference, customer, vehicle, or filter.</p>
          <Button className="mt-5" variant="outline" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      ) : null}
      {!loading && !error && result?.bookings.length ? (
        <>
          <BookingTable
            bookings={result.bookings}
            onView={(booking) => navigate(routes.admin.booking(booking.id))}
            onStatus={(booking) => {
              setActionError('')
              setStatusTarget(booking)
            }}
            onCancel={(booking) => {
              setActionError('')
              setCancelTarget(booking)
            }}
          />
          <BookingMobileCards
            bookings={result.bookings}
            onView={(booking) => navigate(routes.admin.booking(booking.id))}
            onStatus={(booking) => {
              setActionError('')
              setStatusTarget(booking)
            }}
            onCancel={(booking) => {
              setActionError('')
              setCancelTarget(booking)
            }}
          />
          <nav className="flex items-center justify-between gap-3" aria-label="Booking pages">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <p className="text-small text-muted">
              Page {page} of {result.pageCount}
            </p>
            <Button variant="outline" size="sm" disabled={page >= result.pageCount} onClick={() => setPage((current) => current + 1)}>
              Next
            </Button>
          </nav>
        </>
      ) : null}

      <BookingStatusDialog
        booking={statusTarget}
        loading={saving}
        error={actionError}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmStatus}
      />
      <BookingCancelDialog
        booking={cancelTarget}
        loading={saving}
        error={actionError}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
    </div>
  )
}
