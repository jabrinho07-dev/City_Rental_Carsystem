import { Bell, CalendarCheck, CreditCard, FileText, UserRound } from 'lucide-react'
import { ModuleCard } from '@/components/cards/ModuleCard'
import { PageHeader } from '@/components/common/PageHeader'
import { routes } from '@/constants/routes'

const modules = [
  { to: routes.customer.profile, icon: UserRound, title: 'Profile', text: 'Contact details and license information.' },
  { to: routes.customer.bookings, icon: CalendarCheck, title: 'Bookings', text: 'Upcoming and past reservations.' },
  { to: routes.customer.payments, icon: CreditCard, title: 'Payments', text: 'Charges, deposits, and receipts.' },
  { to: routes.customer.invoices, icon: FileText, title: 'Invoices', text: 'Documents for each completed rental.' },
  { to: routes.customer.notifications, icon: Bell, title: 'Notifications', text: 'Pickup reminders and desk messages.' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Customer"
        title="Your rental desk"
        description="This overview will summarize active bookings and messages. Account data is not loaded yet."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((item) => (
          <ModuleCard key={item.to} {...item} />
        ))}
      </div>
    </div>
  )
}
