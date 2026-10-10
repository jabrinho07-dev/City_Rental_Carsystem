import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/ui/Card'

const colors = {
  Pending: '#F59E0B',
  Confirmed: '#16A34A',
  Active: '#172033',
  Completed: '#0B1220',
  Cancelled: '#DC2626',
}

export function BookingOverview({ data = [] }) {
  return (
    <Card>
      <h2 className="text-h3 text-foreground">Booking Overview</h2>
      <p className="mt-1 text-caption text-muted">Sample bookings by status.</p>
      <ul className="mt-4 flex flex-wrap gap-3" aria-label="Booking status legend">
        {data.map((row) => (
          <li key={row.status} className="flex items-center gap-2 text-caption text-muted">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: colors[row.status] }} aria-hidden="true" />
            <span className="font-semibold text-foreground">{row.status}</span>
            <span>{row.count}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="status" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip formatter={(value) => [value, 'Sample bookings']} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#D4A017" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
