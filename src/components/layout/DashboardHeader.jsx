import { Menu } from 'lucide-react'
import { useNavigate } from '@/lib/router'
import { useAuth } from '@/hooks/useAuth'
import { routes } from '@/constants/routes'

export function DashboardHeader({ title, onOpenMenu }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function onLogout() {
    await logout()
    navigate(routes.login)
  }
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-sand lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMenu}
        >
          <Menu size={20} />
        </button>
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="max-w-[8rem] truncate rounded-full border border-line bg-sand px-3 py-1 text-xs font-medium text-muted sm:max-w-none">
          {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        </span>
        {user ? (
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-semibold text-ink hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  )
}
