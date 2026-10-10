import { Bell } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'

export function CustomerNotificationPreview({ notifications = [] }) {
  return (
    <section>
      <h2 className="text-h3 mb-3 text-foreground">Notifications</h2>
      {notifications.length === 0 ? (
        <CustomerEmptyState
          icon={Bell}
          title="No notifications"
          message="Booking and payment updates will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((item) => (
            <li key={item.id}>
              <Card className="flex gap-3 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-canvas text-primary">
                  <Bell size={16} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    {item.unread ? (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" title="Unread">
                        <span className="sr-only">Unread</span>
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-small text-muted">{item.message}</p>
                  <p className="mt-2 text-caption text-muted">{item.time}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        <Button to={routes.customer.notifications} variant="outline" size="sm">
          View All Notifications
        </Button>
      </div>
    </section>
  )
}
