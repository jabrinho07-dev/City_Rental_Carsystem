import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function ExpenseCategoryChart({ categories }) {
  if (!categories?.length) return <p className="text-small text-muted">No recorded expenses to chart.</p>
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categories} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={60} />
          <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
          <Tooltip formatter={(value) => [`${formatMaintenanceMoney(value)} USD`, 'Recorded']} />
          <Bar dataKey="amount" fill="#D4A017" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
