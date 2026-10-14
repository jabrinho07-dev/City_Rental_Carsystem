import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function ExpenseAnalytics({ expenses }) {
  return (
    <div className="space-y-4">
      <p className="text-caption text-muted">
        Rejected expenses are excluded. Approved amounts are not the same as cash paid. Linked maintenance jobs are not added a second time.
      </p>
      <p className="text-small text-foreground">
        Pending approval: {expenses?.pendingCount || 0} · {formatMaintenanceMoney(expenses?.pendingAmount)} USD
      </p>
      {expenses?.approvedByCategory?.length ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenses.approvedByCategory} margin={{ bottom: 40 }}>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={50} />
              <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${formatMaintenanceMoney(value)} USD`, 'Approved']} />
              <Bar dataKey="amount" fill="#D4A017" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : <p className="text-small text-muted">No approved expenses in this period.</p>}
      <div>
        <h3 className="text-small font-semibold text-foreground">Paid cash by category</h3>
        {expenses?.paidByCategory?.length ? (
          <ul className="mt-2 divide-y divide-border">
            {expenses.paidByCategory.map((item) => (
              <li key={item.category} className="flex justify-between py-2 text-small">
                <span>{item.category}</span>
                <span>{formatMaintenanceMoney(item.amount)} USD</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-small text-muted">No paid expenses in this period.</p>}
      </div>
    </div>
  )
}
