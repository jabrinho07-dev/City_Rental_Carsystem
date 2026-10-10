import { LifeBuoy, LogOut, X } from 'lucide-react'
import { NavLink } from '@/lib/router'
import { BrandMark } from '@/components/common/BrandMark'
import { customerNav } from '@/constants/navigation'
import { routes } from '@/constants/routes'
import { cn } from '@/utils/cn'

function initials(user) {
  const letters = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()
  return letters || 'CR'
}

export function CustomerSidebar({ user, open, onClose, onLogout }) {
  const name = user ? `${user.firstName} ${user.lastName}`.trim() : 'Customer'

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={cn('fixed inset-0 z-30 bg-primary/50 lg:hidden', open ? 'block' : 'hidden')}
        onClick={onClose}
      />
      <aside
        id="customer-sidebar"
        aria-label="Customer"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-primary text-white transition-transform lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:w-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <BrandMark tone="light" />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3" aria-label="Customer">
          {customerNav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    isActive ? 'bg-accent text-primary' : 'text-white/75 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
          <p className="px-3 pt-6 pb-2 text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">Support</p>
          <NavLink
            to={routes.contact}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <LifeBuoy size={18} aria-hidden="true" />
            Contact Support
          </NavLink>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-primary">
              {initials(user)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-white/60">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <LogOut size={16} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
