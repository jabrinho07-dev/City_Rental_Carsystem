import { Bell, ChevronDown, LogOut, Search, Settings, User } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { roleTitle } from '@/components/admin/AdminSidebar'

export function AdminHeader({ title, subtitle, notices = [], noticesOpen = false, onToggleNotices }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const menuRef = useRef(null)
  const noticeRef = useRef(null)
  const menuId = useId()
  const noticeId = useId()

  useEffect(() => {
    function onPointerDown(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
      if (!event.target.closest('[data-admin-notices]')) onToggleNotices(false)
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        onToggleNotices(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onToggleNotices])

  async function onLogout() {
    setMenuOpen(false)
    await logout()
    navigate(routes.login)
  }

  function onMenuKeyDown(event) {
    const items = [...menuRef.current.querySelectorAll('[role="menuitem"]')]
    const index = items.indexOf(document.activeElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      items[(index + 1) % items.length]?.focus()
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      items[(index - 1 + items.length) % items.length]?.focus()
    }
  }

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="hidden min-w-0 lg:block">
        <h1 className="text-h2 text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-small text-muted">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-2 lg:shrink-0">
        <form className="relative min-w-0 flex-1 lg:w-56" onSubmit={(event) => event.preventDefault()}>
          <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search operations"
            placeholder="Search"
            className="h-10 w-full rounded-md border border-border bg-surface pr-3 pl-9 text-small text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </form>
        <div className="relative hidden lg:block" ref={noticeRef} data-admin-notices>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={notices.length ? `Notifications, ${notices.length} updates` : 'Notifications'}
            aria-expanded={noticesOpen}
            aria-controls={noticeId}
            onClick={() => onToggleNotices(!noticesOpen)}
          >
            <Bell size={18} aria-hidden="true" />
            {notices.length > 0 ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" /> : null}
          </button>
          {noticesOpen ? (
            <div id={noticeId} className="absolute right-0 z-30 mt-2 w-72 rounded-lg border border-border bg-surface p-3 shadow-card">
              <p className="text-caption font-semibold tracking-[0.14em] text-muted uppercase">Sample updates</p>
              <ul className="mt-2 space-y-2">
                {notices.map((notice) => (
                  <li key={notice.id} className="rounded-md bg-canvas px-3 py-2">
                    <p className="text-small font-medium text-foreground">{notice.title}</p>
                    <p className="text-caption text-muted">{notice.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="relative hidden lg:block" ref={menuRef}>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-small font-semibold text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="max-w-28 truncate">{user?.firstName || roleTitle(user?.role)}</span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          {menuOpen ? (
            <div id={menuId} role="menu" aria-label="Account" className="absolute right-0 z-30 mt-2 w-48 rounded-lg border border-border bg-surface p-1 shadow-card" onKeyDown={onMenuKeyDown}>
              <p className="px-3 py-2 text-caption text-muted">{roleTitle(user?.role)}</p>
              <Link role="menuitem" to={routes.admin.profile} className="flex items-center gap-2 rounded-md px-3 py-2 text-small font-medium hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={() => setMenuOpen(false)}>
                <User size={16} aria-hidden="true" />
                Profile
              </Link>
              <Link role="menuitem" to={routes.admin.settings} className="flex items-center gap-2 rounded-md px-3 py-2 text-small font-medium hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={() => setMenuOpen(false)}>
                <Settings size={16} aria-hidden="true" />
                Settings
              </Link>
              <button type="button" role="menuitem" className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-small font-medium hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={onLogout}>
                <LogOut size={16} aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
