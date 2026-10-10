import { Bell, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from '@/components/common/BrandMark'
import { routes } from '@/constants/routes'

function initials(user) {
  const letters = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()
  return letters || 'CR'
}

export function CustomerMobileHeader({ user, unreadCount = 0, menuOpen = false, onOpenMenu }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Open menu"
          aria-controls="customer-sidebar"
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
        <BrandMark compact />
      </div>
      <div className="flex items-center gap-1">
        <Link
          to={routes.customer.notifications}
          className="relative grid h-10 w-10 place-items-center rounded-lg text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        >
          <Bell size={18} aria-hidden="true" />
          {unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary">
              {unreadCount}
            </span>
          ) : null}
        </Link>
        <Link
          to={routes.customer.profile}
          className="grid size-10 place-items-center rounded-full bg-primary text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Open profile"
        >
          {initials(user)}
        </Link>
      </div>
    </header>
  )
}
