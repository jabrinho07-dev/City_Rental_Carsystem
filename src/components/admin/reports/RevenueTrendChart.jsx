import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function RevenueTrendChart({ points, mode }) {
  if (!points?.length) return <p className="text-small text-muted">No collected payments or refunds in this period.</p>
  return (
    <div>
      <p className="mb-3 text-caption text-muted">Grouped by {mode}. Net is collected payments minus refunds. USD.</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
            <Tooltip formatter={(value, name) => [`${formatMaintenanceMoney(value)} USD`, name]} />
            <Area dataKey="net" name="Net collected" stroke="#0B1220" fill="#D4A017" fillOpacity={0.35} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
