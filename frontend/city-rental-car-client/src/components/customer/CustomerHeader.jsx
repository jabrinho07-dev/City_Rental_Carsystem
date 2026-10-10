import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { UserMenu } from '@/components/auth/UserMenu'
import { routes } from '@/constants/routes'

export function CustomerHeader({ title, subtitle, unreadCount = 0 }) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-h2 text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-small text-muted">{subtitle}</p> : null}
      </div>
      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        <Link
          to={routes.customer.notifications}
          className="relative grid h-11 w-11 place-items-center rounded-lg border border-border bg-surface text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        >
          <Bell size={18} aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary">
              {unreadCount}
            </span>
          ) : null}
        </Link>
        <UserMenu />
      </div>
    </header>
  )
}
