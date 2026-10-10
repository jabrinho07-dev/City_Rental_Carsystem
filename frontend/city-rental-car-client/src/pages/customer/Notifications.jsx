import { useEffect, useState } from 'react'
import { Bell, Trash2 } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { deleteNotification, getNotifications, markAllNotificationsRead, markNotificationRead } from '@/services/customerService'

const categoryVariant = {
  Booking: 'confirmed',
  Payment: 'paid',
  Rental: 'available',
  System: 'pending',
}

export default function Notifications() {
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    getNotifications().then((next) => {
      if (active) setItems(next)
    })
    return () => {
      active = false
    }
  }, [])

  async function markOne(id) {
    setItems(await markNotificationRead(id))
  }

  async function markAll() {
    setItems(await markAllNotificationsRead())
  }

  async function remove(id) {
    setItems(await deleteNotification(id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={markAll} disabled={items.every((item) => !item.unread)}>
          Mark all as read
        </Button>
      </div>
      {items.length === 0 ? (
        <CustomerEmptyState icon={Bell} title="No notifications" message="You are up to date. New rental updates will appear here." />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-canvas text-primary">
                  <Bell size={16} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-foreground">{item.title}</h2>
                    <Badge variant={categoryVariant[item.category] || 'pending'}>{item.category}</Badge>
                    {item.unread ? <span className="text-caption font-semibold text-accent">Unread</span> : <span className="text-caption text-muted">Read</span>}
                  </div>
                  <p className="mt-1 text-small text-muted">{item.message}</p>
                  <p className="mt-2 text-caption text-muted">{item.time}</p>
                </div>
                <div className="flex gap-2">
                  {item.unread ? (
                    <Button size="sm" variant="outline" onClick={() => markOne(item.id)}>
                      Mark as read
                    </Button>
                  ) : null}
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-md border border-border text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
