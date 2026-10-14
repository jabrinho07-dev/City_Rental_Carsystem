import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { CustomerFilters } from '@/components/admin/customers/CustomerFilters'
import { CustomerMobileCards } from '@/components/admin/customers/CustomerMobileCards'
import { CustomerSearch } from '@/components/admin/customers/CustomerSearch'
import { CustomerSort } from '@/components/admin/customers/CustomerSort'
import { CustomerStats } from '@/components/admin/customers/CustomerStats'
import { CustomerTable } from '@/components/admin/customers/CustomerTable'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { CustomerError, getCustomers } from '@/services/customerService'
import { downloadCsv, toCsv } from '@/utils/exportCsv'

const initialFilters = { status: '', registeredFrom: '', registeredTo: '', activity: '', sort: 'newest', pageSize: 6 }

const columns = [
  { key: 'id', label: 'Customer ID' },
  { key: 'firstName', label: 'First name' },
  { key: 'lastName', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'city', label: 'City' },
  { key: 'country', label: 'Country' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Registered' },
  { key: 'totalBookings', label: 'Linked bookings' },
  { key: 'completedBookings', label: 'Completed bookings' },
  { key: 'cancelledBookings', label: 'Cancelled bookings' },
  { key: 'totalSpent', label: 'Collected payments USD' },
  { key: 'lastBookingDate', label: 'Last booking' },
  { key: 'notes', label: 'Notes' },
]

export default function CustomersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const active = [
    search ? `Search: ${search}` : '',
    filters.status,
    filters.registeredFrom ? `From ${filters.registeredFrom}` : '',
    filters.registeredTo ? `To ${filters.registeredTo}` : '',
    filters.activity === 'bookings' ? 'Has bookings' : '',
    filters.activity === 'none' ? 'No bookings' : '',
    filters.activity === 'open' ? 'Open rental' : '',
    filters.sort !== 'newest' ? 'Custom sort' : '',
  ].filter(Boolean)

  async function load(nextPage = page) {
    setLoading(true)
    setError('')
    try {
      const data = await getCustomers({ search, ...filters, page: nextPage })
      setResult(data)
      setPage(data.page)
    } catch (loadError) {
      setError(loadError instanceof CustomerError ? loadError.message : 'The customer list could not be loaded.')
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

  async function exportCustomers() {
    const data = await getCustomers({ search, ...filters, page: 1, pageSize: 50 })
    if (!data.total) {
      setNotice('No customers match the current filters, so the export was not created.')
      return
    }
    const full = await getCustomers({ search, ...filters, page: 1, pageSize: Math.max(data.total, 1) })
    downloadCsv('city-rental-customers.csv', toCsv(full.customers, columns))
    setNotice(`Exported ${full.total} customer${full.total === 1 ? '' : 's'}.`)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">Customers</h1>
          <p className="mt-1 max-w-2xl text-small text-muted">
            Renter profiles from the desk directory and the signed-in customer account. Booking counts and collected amounts come only from linked booking and payment records.
          </p>
        </div>
        <Button variant="outline" onClick={exportCustomers}>Export CSV</Button>
      </div>
      {notice ? <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-small font-medium text-success" role="status">{notice}</p> : null}
      <CustomerStats stats={result?.stats} />
      <section className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <CustomerSearch value={search} onChange={(value) => { setPage(1); setSearch(value) }} />
          <CustomerSort value={filters.sort} pageSize={filters.pageSize} onChange={(value) => changeFilter('sort', value)} onPageSize={(value) => changeFilter('pageSize', value)} />
        </div>
        <CustomerFilters filters={filters} onChange={changeFilter} />
        {active.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {active.map((item) => (
              <span key={item} className="rounded-full border border-border bg-canvas px-2.5 py-1 text-caption font-medium text-foreground">{item}</span>
            ))}
            <button type="button" className="rounded-md px-2 py-1 text-caption font-semibold text-primary hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        ) : null}
      </section>
      {loading ? <p className="text-small text-muted">Loading customers...</p> : null}
      {error ? (
        <div className="rounded-lg border border-danger/30 bg-surface p-5">
          <p className="text-body text-danger">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => load(page)}>Try again</Button>
        </div>
      ) : null}
      {!loading && !error && result?.customers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center">
          <h2 className="text-h3 text-foreground">No customers match</h2>
          <p className="mx-auto mt-2 max-w-md text-small text-muted">Try another name, email, phone, status, or date range.</p>
          <Button className="mt-5" variant="outline" onClick={resetFilters}>Clear filters</Button>
        </div>
      ) : null}
      {!loading && !error && result?.customers.length ? (
        <>
          <CustomerTable customers={result.customers} onView={(customer) => navigate(routes.admin.customer(customer.id))} />
          <CustomerMobileCards customers={result.customers} onView={(customer) => navigate(routes.admin.customer(customer.id))} />
          <nav className="flex items-center justify-between gap-3" aria-label="Customer pages">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</Button>
            <p className="text-small text-muted">Page {page} of {result.pageCount}</p>
            <Button variant="outline" size="sm" disabled={page >= result.pageCount} onClick={() => setPage((current) => current + 1)}>Next</Button>
          </nav>
        </>
      ) : null}
    </div>
  )
}
