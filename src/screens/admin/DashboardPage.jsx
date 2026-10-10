import {
  CalendarCheck,
  CarFront,
  ChartColumn,
  CreditCard,
  Receipt,
  Settings,
  Users,
  Wrench,
} from 'lucide-react'
import { ModuleCard } from '@/components/cards/ModuleCard'
import { PageHeader } from '@/components/common/PageHeader'
import { routes } from '@/constants/routes'

const modules = [
  { to: routes.admin.vehicles, icon: CarFront, title: 'Vehicles', text: 'Fleet records and availability.' },
  { to: routes.admin.bookings, icon: CalendarCheck, title: 'Bookings', text: 'Reservations across the desk.' },
  { to: routes.admin.customers, icon: Users, title: 'Customers', text: 'Renter profiles and documents.' },
  { to: routes.admin.payments, icon: CreditCard, title: 'Payments', text: 'Charges collected against bookings.' },
  { to: routes.admin.maintenance, icon: Wrench, title: 'Maintenance', text: 'Service work that takes a car offline.' },
  { to: routes.admin.expenses, icon: Receipt, title: 'Expenses', text: 'Operating costs for the fleet.' },
  { to: routes.admin.reports, icon: ChartColumn, title: 'Reports', text: 'Summaries for the rental operation.' },
  { to: routes.admin.settings, icon: Settings, title: 'Settings', text: 'Desk preferences and company details.' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Operations overview"
        description="This desk will summarize the fleet, bookings, and payments. No operational data is loaded yet."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((item) => (
          <ModuleCard key={item.to} {...item} />
        ))}
      </div>
    </div>
  )
}
