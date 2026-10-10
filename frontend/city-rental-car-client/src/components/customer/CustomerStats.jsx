import { CalendarCheck, CarFront, CircleCheck, Clock3 } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const cards = [
  { key: 'totalBookings', label: 'Total Bookings', note: 'All requests', icon: CalendarCheck },
  { key: 'activeRentals', label: 'Active Rentals', note: 'On the road', icon: CarFront },
  { key: 'completedTrips', label: 'Completed Trips', note: 'Finished', icon: CircleCheck },
  { key: 'pendingBookings', label: 'Pending Bookings', note: 'Awaiting confirmation', icon: Clock3 },
]

export function CustomerStats({ stats }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Rental summary">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.key} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-small text-muted">{card.label}</p>
              <span className="grid size-9 place-items-center rounded-lg bg-canvas text-primary">
                <Icon size={16} aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-foreground">{stats?.[card.key] ?? 0}</p>
            <p className="mt-1 text-caption text-muted">{card.note}</p>
          </Card>
        )
      })}
    </section>
  )
}
