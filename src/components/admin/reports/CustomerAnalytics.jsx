import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function CustomerAnalytics({ customers }) {
  return (
    <div className="space-y-4">
      <p className="text-caption text-muted">
        Counts use bookings created in this period, excluding cancelled and rejected bookings. Names and email addresses only.
      </p>
      <p className="text-small text-foreground">
        Repeat customers {customers?.repeatCount || 0}
        {customers?.averageCompleted != null ? ` · Average completed booking ${formatMaintenanceMoney(customers.averageCompleted)} USD` : ''}
      </p>
      {customers?.rows?.length ? (
        <ul className="divide-y divide-border">
          {customers.rows.slice(0, 5).map((customer) => (
            <li key={customer.email || customer.name} className="flex justify-between gap-3 py-2 text-small">
              <span>{customer.name}</span>
              <span className="text-muted">{customer.completed} completed · {customer.bookings} bookings</span>
            </li>
          ))}
        </ul>
      ) : <p className="text-small text-muted">No eligible bookings in this period.</p>}
      <div>
        <h3 className="text-small font-semibold text-foreground">Popular categories</h3>
        {customers?.categories?.length ? (
          <ul className="mt-2 divide-y divide-border">
            {customers.categories.map((item) => (
              <li key={item.category} className="flex justify-between py-2 text-small">
                <span>{item.category}</span>
                <span>{item.count}</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-small text-muted">No category counts for this period.</p>}
      </div>
    </div>
  )
}
