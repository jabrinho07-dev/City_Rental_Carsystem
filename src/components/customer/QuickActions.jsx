import { CalendarCheck, CarFront, CreditCard, LifeBuoy, Receipt, User } from 'lucide-react'
import { Link } from '@/lib/router'
import { routes } from '@/constants/routes'

const actions = [
  { label: 'Book a Car', to: routes.cars, icon: CarFront },
  { label: 'View Bookings', to: routes.customer.bookings, icon: CalendarCheck },
  { label: 'Make Payment', to: routes.customer.payments, icon: CreditCard },
  { label: 'View Invoices', to: routes.customer.invoices, icon: Receipt },
  { label: 'Update Profile', to: routes.customer.profile, icon: User },
  { label: 'Contact Support', to: routes.contact, icon: LifeBuoy },
]

export function QuickActions() {
  return (
    <section>
      <h2 className="text-h3 mb-3 text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
