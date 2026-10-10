import { Bell, Menu } from 'lucide-react'
import { BrandMark } from '@/components/common/BrandMark'

export function AdminMobileHeader({ title, noticeCount = 0, menuOpen = false, onOpenMenu, onOpenNotices }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-surface px-3 py-3 lg:hidden">
      <BrandMark compact />
      <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{title}</p>
      <button
        type="button"
        className="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={noticeCount ? `Notifications, ${noticeCount} updates` : 'Notifications'}
        data-admin-notices
        onClick={onOpenNotices}
      >
        <Bell size={18} aria-hidden="true" />
        {noticeCount > 0 ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" /> : null}
      </button>
      <button
        type="button"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Open menu"
        aria-controls="admin-sidebar"
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
      >
        <Menu size={20} aria-hidden="true" />
      </button>
    </header>
  )
}
