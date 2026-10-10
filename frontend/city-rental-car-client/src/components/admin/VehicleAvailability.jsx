import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '@/components/ui/Card'

const colors = {
  Available: '#16A34A',
  Reserved: '#F59E0B',
  Rented: '#172033',
  Maintenance: '#DC2626',
  Inactive: '#64748B',
}

export function VehicleAvailability({ data = [] }) {
  return (
    <Card className="h-full">
      <h2 className="text-h3 text-foreground">Vehicle Availability</h2>
      <p className="mt-1 text-caption text-muted">Sample fleet status.</p>
      <div className="mx-auto mt-2 h-52 w-full max-w-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={52} outerRadius={78} paddingAngle={2}>
              {data.map((row) => (
                <Cell key={row.status} fill={colors[row.status]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 space-y-2" aria-label="Vehicle availability legend">
        {data.map((row) => (
          <li key={row.status} className="flex items-center justify-between gap-3 text-small">
            <span className="flex items-center gap-2 text-foreground">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: colors[row.status] }} aria-hidden="true" />
              {row.status}
            </span>
            <span className="font-semibold">{row.count}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
