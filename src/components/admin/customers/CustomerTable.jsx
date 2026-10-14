import { CustomerStatusBadge } from '@/components/admin/customers/CustomerStatusBadge'
import { Button } from '@/components/ui/Button'
import { formatMediumDate } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function CustomerTable({ customers, onView }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface shadow-card lg:block">
      <table className="w-full min-w-[52rem] border-collapse text-left">
        <caption className="sr-only">Customers</caption>
        <thead className="bg-canvas text-caption font-semibold tracking-wide text-muted uppercase">
          <tr>
            {['Customer', 'Status', 'Registered', 'Linked bookings', 'Collected', 'Actions'].map((heading) => (
              <th key={heading} scope="col" className="px-3 py-3 font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t border-border">
              <th scope="row" className="px-3 py-3">
                <p className="text-small font-semibold text-foreground">{customer.name}</p>
                <p className="text-caption text-muted">{customer.email}</p>
                <p className="text-caption text-muted">{customer.phone}</p>
              </th>
              <td className="px-3 py-3"><CustomerStatusBadge status={customer.status} /></td>
              <td className="px-3 py-3 text-small text-foreground">{customer.createdAt ? formatMediumDate(customer.createdAt) : 'Not recorded'}</td>
              <td className="px-3 py-3 text-small text-foreground">{customer.totalBookings}</td>
              <td className="px-3 py-3 text-small font-semibold text-foreground">{formatMaintenanceMoney(customer.totalSpent)}</td>
              <td className="px-3 py-3">
                <Button size="sm" variant="outline" onClick={() => onView(customer)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
