import { Bell, CalendarCheck, CarFront, CreditCard, UserPlus } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Card } from '@/components/ui/Card'

const icons = {
  Booking: CalendarCheck,
  Payment: CreditCard,
  Vehicle: CarFront,
  Customer: UserPlus,
}

export function RecentActivity({ activity = [] }) {
  return (
    <section>
      <h2 className="text-h3 mb-3 text-foreground">Recent Activity</h2>
      {activity.length === 0 ? (
        <AdminEmptyState icon={Bell} title="No activity" message="Desk updates will appear here." />
      ) : (
        <Card>
          <ol className="space-y-4">
            {activity.map((item, index) => {
              const Icon = icons[item.status] || Bell
              return (
                <li key={item.id} className="relative flex gap-3">
                  {index < activity.length - 1 ? <span className="absolute top-9 bottom-[-16px] left-[17px] w-px bg-border" aria-hidden="true" /> : null}
                  <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-canvas text-primary">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-small font-medium break-words text-foreground">{item.description}</p>
                    <p className="mt-1 text-caption text-muted">
                      {item.time}
                      <span className="px-1" aria-hidden="true">
                        ·
                      </span>
                      {item.status}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Card>
      )}
    </section>
  )
}
