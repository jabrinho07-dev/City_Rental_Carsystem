import { ChevronRight } from 'lucide-react'
import { Link } from '@/lib/router'

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-1.5 text-caption text-muted">
        {items.map((item, index) => {
          const current = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? <ChevronRight size={14} aria-hidden="true" className="shrink-0" /> : null}
              {current || !item.to ? (
                <span aria-current={current ? 'page' : undefined} className="truncate text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="shrink-0 rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
