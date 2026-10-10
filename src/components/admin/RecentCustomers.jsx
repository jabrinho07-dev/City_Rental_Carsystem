import { Users } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { formatMediumDate } from '@/utils/customerFormat'

const statusVariant = {
  Active: 'available',
  Inactive: 'completed',
  Blocked: 'cancelled',
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function RecentCustomers({ customers = [] }) {
  return (
    <section className="min-w-0">
      <h2 className="text-h3 mb-3 text-foreground">Recent Customers</h2>
      {customers.length === 0 ? (
        <AdminEmptyState icon={Users} title="No customers" message="New renter profiles will appear here." />
      ) : (
        <ul className="space-y-3">
          {customers.map((customer) => (
            <li key={customer.id}>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
                    {initials(customer.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold break-words text-foreground">{customer.name}</p>
                        <p className="text-small break-all text-muted">{customer.email}</p>
                      </div>
                      <Badge variant={statusVariant[customer.status] || 'pending'}>{customer.status}</Badge>
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-caption text-muted sm:grid-cols-3">
                      <div>
                        <dt>Phone</dt>
                        <dd className="font-medium break-words text-foreground">{customer.phone}</dd>
                      </div>
                      <div>
                        <dt>Bookings</dt>
                        <dd className="font-medium text-foreground">{customer.bookings}</dd>
                      </div>
                      <div>
                        <dt>Joined</dt>
                        <dd className="font-medium text-foreground">{formatMediumDate(customer.joined)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Button to={routes.admin.customers} variant="outline" size="sm">
          View All Customers
        </Button>
      </div>
    </section>
  )
}
