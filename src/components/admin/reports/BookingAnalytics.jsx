import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function BookingAnalytics({ bookings }) {
  const completed = bookings?.statuses?.find((item) => item.status === 'Completed')?.count || 0
  const cancelled = bookings?.statuses?.find((item) => item.status === 'Cancelled')?.count || 0
  return (
    <div className="space-y-4">
      <p className="text-caption text-muted">
        Status counts use the booking creation date. Pickup demand uses the pickup date. Average value uses bookings that are not cancelled or rejected.
        {bookings?.average != null ? ` Average booking value ${formatMaintenanceMoney(bookings.average)} USD.` : ' Not enough bookings for an average.'}
      </p>
      <p className="text-small text-foreground">Completed {completed} · Cancelled {cancelled}</p>
      {bookings?.statuses?.some((item) => item.count) ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookings.statuses}>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="status" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Bookings" fill="#172033" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <p className="text-small text-muted">No bookings were created in this period.</p>}
      <div>
        <h3 className="text-small font-semibold text-foreground">Pickup demand</h3>
        {bookings?.demand?.length ? (
          <ul className="mt-2 divide-y divide-border">
            {bookings.demand.map((item) => (
              <li key={item.date} className="flex justify-between py-2 text-small">
                <span>{item.date}</span>
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-small text-muted">No pickups fall in this period.</p>}
      </div>
    </div>
  )
}
