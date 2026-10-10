import { CalendarCheck, CarFront, CircleDollarSign, Clock3, Users, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { formatMoney } from '@/utils/customerFormat'

const cards = [
  { key: 'totalVehicles', label: 'Total Vehicles', icon: CarFront },
  { key: 'available', label: 'Available', icon: CarFront },
  { key: 'rented', label: 'Rented', icon: CarFront },
  { key: 'reserved', label: 'Reserved', icon: CalendarCheck },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench },
  { key: 'totalCustomers', label: 'Total Customers', icon: Users },
  { key: 'pendingBookings', label: 'Pending Bookings', icon: Clock3 },
  { key: 'todaysRentals', label: "Today's Rentals", icon: CalendarCheck },
  { key: 'monthlyRevenue', label: 'Monthly Revenue', icon: CircleDollarSign },
  { key: 'outstandingPayments', label: 'Outstanding Payments', icon: CircleDollarSign },
]

export function AdminStats({ stats = {} }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Operations summary">
      {cards.map((card) => {
        const Icon = card.icon
        const item = stats[card.key] || { value: 0, note: '' }
        const value = item.money ? formatMoney(item.value) : new Intl.NumberFormat('en-US').format(item.value || 0)
        return (
          <Card key={card.key} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-small text-muted">{card.label}</p>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-canvas text-primary">
                <Icon size={16} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
            <p className="mt-1 flex items-center gap-2 text-caption text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              {item.note}
            </p>
          </Card>
        )
      })}
    </section>
  )
}
