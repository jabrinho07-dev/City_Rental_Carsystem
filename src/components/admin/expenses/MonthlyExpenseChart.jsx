import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function MonthlyExpenseChart({ months }) {
  if (!months?.length) return <p className="text-small text-muted">No monthly expense records yet.</p>
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={months} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 11 }} />
          <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
          <Tooltip formatter={(value) => [`${formatMaintenanceMoney(value)} USD`, 'Recorded']} />
          <Area dataKey="amount" stroke="#0B1220" fill="#D4A017" fillOpacity={0.35} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
