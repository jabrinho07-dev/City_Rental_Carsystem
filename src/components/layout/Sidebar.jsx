import { X } from 'lucide-react'
import { NavLink } from '@/lib/router'
import { BrandMark } from '@/components/common/BrandMark'
import { cn } from '@/utils/cn'

export function Sidebar({ label, items, open, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        className={cn('fixed inset-0 z-30 bg-ink/50 lg:hidden', open ? 'block' : 'hidden')}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ink text-white transition-transform lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:w-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <BrandMark tone="light" />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <p className="px-5 text-[11px] font-semibold tracking-[0.16em] text-brass uppercase">{label}</p>
        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-6" aria-label={label}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                    isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
