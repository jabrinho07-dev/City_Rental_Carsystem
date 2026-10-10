import { BarChart3, CalendarCheck, CarFront, CreditCard, UserPlus, WalletCards } from 'lucide-react'
import { Link } from '@/lib/router'
import { routes } from '@/constants/routes'

const actions = [
  { label: 'Add Vehicle', to: routes.admin.newVehicle, icon: CarFront },
  { label: 'View Bookings', to: routes.admin.bookings, icon: CalendarCheck },
  { label: 'Add Customer', to: routes.admin.customers, icon: UserPlus },
  { label: 'Record Payment', to: routes.admin.payments, icon: CreditCard },
  { label: 'Add Expense', to: routes.admin.expenses, icon: WalletCards },
  { label: 'View Reports', to: routes.admin.reports, icon: BarChart3 },
]

export function AdminQuickActions() {
  return (
    <section>
      <h2 className="text-h3 mb-3 text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              to={action.to}
              className="flex min-h-24 flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-card transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Icon size={18} className="text-accent" aria-hidden="true" />
              <span className="mt-3 text-small font-semibold text-foreground">{action.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
