import { CustomerStatusBadge } from '@/components/admin/customers/CustomerStatusBadge'
import { Button } from '@/components/ui/Button'
import { formatMediumDate } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function CustomerMobileCards({ customers, onView }) {
  return (
    <ul className="space-y-3 lg:hidden">
      {customers.map((customer) => (
        <li key={customer.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{customer.name}</p>
              <p className="text-small break-all text-muted">{customer.email}</p>
              <p className="text-small text-muted">{customer.phone}</p>
            </div>
            <CustomerStatusBadge status={customer.status} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-caption text-muted">
            <div>
              <dt>Registered</dt>
              <dd className="font-medium text-foreground">{customer.createdAt ? formatMediumDate(customer.createdAt) : 'Not recorded'}</dd>
            </div>
            <div>
              <dt>Linked bookings</dt>
              <dd className="font-medium text-foreground">{customer.totalBookings}</dd>
            </div>
            <div>
              <dt>Collected</dt>
              <dd className="font-medium text-foreground">{formatMaintenanceMoney(customer.totalSpent)}</dd>
            </div>
          </dl>
          <Button className="mt-4" size="sm" variant="outline" onClick={() => onView(customer)}>View customer</Button>
        </li>
      ))}
    </ul>
  )
}
