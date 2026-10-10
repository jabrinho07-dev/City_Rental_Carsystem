import { LogOut, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { BrandMark } from '@/components/common/BrandMark'
import { adminNavSections } from '@/constants/navigation'
import { cn } from '@/utils/cn'

function initials(user) {
  const letters = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()
  return letters || 'AD'
}

export function roleTitle(role) {
  if (role === 'SUPER_ADMIN') return 'Super Admin'
  if (role === 'STAFF') return 'Staff'
  return 'Admin'
}

export function AdminSidebar({ user, open, onClose, onLogout }) {
  const name = user ? `${user.firstName} ${user.lastName}`.trim() : roleTitle(user?.role)

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={cn('fixed inset-0 z-30 bg-primary/50 lg:hidden', open ? 'block' : 'hidden')}
        onClick={onClose}
      />
      <aside
        id="admin-sidebar"
        aria-label="Administration"
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
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4" aria-label="Administration">
          {adminNavSections.map((section) => (
            <div key={section.label}>
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-accent uppercase">{section.label}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                          isActive
                            ? 'bg-accent font-semibold text-primary shadow-[inset_3px_0_0_#0B1220]'
                            : 'font-medium text-white/75 hover:bg-white/10 hover:text-white',
                        )
                      }
                    >
                      <Icon size={18} aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-primary">
              {initials(user)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-white/60">{roleTitle(user?.role)}</p>
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
