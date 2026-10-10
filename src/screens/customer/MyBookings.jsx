import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/lib/router'
import { CalendarCheck } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { routes } from '@/constants/routes'
import { getBookings } from '@/services/customerService'
import { bookingStatusView, formatMoney, formatMediumDate } from '@/utils/customerFormat'

const statuses = ['All', 'Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected']

function ViewLink({ id }) {
  return (
    <Link
      to={routes.customer.booking(id)}
      className="text-small font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      View Details
    </Link>
  )
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [fromDate, setFromDate] = useState('')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    let active = true
    getBookings().then((items) => {
      if (active) setBookings(items)
    })
    return () => {
      active = false
    }
  }, [])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = bookings.filter((booking) => {
      const matchesQuery = !term || `${booking.id} ${booking.vehicleName}`.toLowerCase().includes(term)
      const matchesStatus = status === 'All' || booking.status === status
      const matchesDate = !fromDate || booking.pickupDate >= fromDate
      return matchesQuery && matchesStatus && matchesDate
    })
    const sorted = [...filtered]
    if (sort === 'oldest') sorted.sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))
    if (sort === 'newest') sorted.sort((a, b) => b.pickupDate.localeCompare(a.pickupDate))
    if (sort === 'amount-high') sorted.sort((a, b) => b.amount - a.amount)
    if (sort === 'amount-low') sorted.sort((a, b) => a.amount - b.amount)
    return sorted
  }, [bookings, query, status, fromDate, sort])

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input id="booking-search" label="Search" placeholder="Reference or vehicle" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select
          id="booking-status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={statuses.map((item) => ({ value: item, label: item }))}
        />
        <Input id="booking-from" label="Pickup from" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
        <Select
          id="booking-sort"
          label="Sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          options={[
            { value: 'newest', label: 'Newest pickup' },
            { value: 'oldest', label: 'Oldest pickup' },
            { value: 'amount-high', label: 'Amount high to low' },
            { value: 'amount-low', label: 'Amount low to high' },
          ]}
        />
      </div>

      {visible.length === 0 ? (
        <CustomerEmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          message={bookings.length ? 'No bookings match these filters.' : "You haven't made any rental bookings yet."}
          actionLabel="Browse Cars"
          actionTo={routes.cars}
        />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 lg:block">
            <table className="w-full text-left text-small">
              <thead className="bg-canvas text-caption tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                  <th className="px-4 py-3 font-semibold">Vehicle</th>
                  <th className="px-4 py-3 font-semibold">Pickup</th>
                  <th className="px-4 py-3 font-semibold">Return</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((booking) => {
                  const view = bookingStatusView(booking.status)
                  return (
                    <tr key={booking.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{booking.id}</td>
                      <td className="px-4 py-3">{booking.vehicleName}</td>
                      <td className="px-4 py-3">{formatMediumDate(booking.pickupDate)}</td>
                      <td className="px-4 py-3">{formatMediumDate(booking.returnDate)}</td>
                      <td className="px-4 py-3">{formatMoney(booking.amount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={view.variant}>{view.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ViewLink id={booking.id} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
          <ul className="space-y-3 lg:hidden">
            {visible.map((booking) => {
              const view = bookingStatusView(booking.status)
              return (
                <li key={booking.id}>
                  <Card className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-caption font-semibold text-accent">{booking.id}</p>
                        <h2 className="mt-1 text-body font-semibold text-foreground">{booking.vehicleName}</h2>
                      </div>
                      <Badge variant={view.variant}>{view.label}</Badge>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-small">
                      <div>
                        <dt className="text-muted">Pickup</dt>
                        <dd>{formatMediumDate(booking.pickupDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted">Return</dt>
                        <dd>{formatMediumDate(booking.returnDate)}</dd>
                      </div>
                    </dl>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{formatMoney(booking.amount)}</p>
                      <ViewLink id={booking.id} />
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
