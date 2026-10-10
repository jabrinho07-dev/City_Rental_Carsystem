import { ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from '@/lib/router'
import { accountNav } from '@/constants/navigation'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!user) return null
  const links = accountNav(user.role)

  async function onLogout() {
    setOpen(false)
    await logout()
    navigate(routes.login)
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex h-10 max-w-44 items-center gap-2 rounded-md px-2 text-small font-semibold text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{user.firstName}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open ? (
        <div id={menuId} role="menu" className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-border bg-surface p-2 shadow-dropdown">
          <div className="border-b border-border px-2 py-2">
            <p className="truncate text-small font-semibold text-foreground">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-caption text-muted">{user.email}</p>
          </div>
          <div className="mt-1 grid">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                role="menuitem"
                className="rounded-md px-2 py-2 text-small text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              role="menuitem"
              className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-left text-small text-foreground hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={onLogout}
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
