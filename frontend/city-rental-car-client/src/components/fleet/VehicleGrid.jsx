import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VehicleCard } from '@/components/cards/VehicleCard'
import { routes } from '@/constants/routes'
import { cn } from '@/utils/cn'

export function VehicleGrid({ vehicles }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} bookTo={routes.login} />
      ))}
    </div>
  )
}

export function FleetPagination({ page, pageCount, onPage }) {
  if (pageCount < 2) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Vehicle pages">
      <PageButton disabled={page === 1} onClick={() => onPage(page - 1)}>
        <ChevronLeft size={16} aria-hidden="true" />
        Previous
      </PageButton>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          aria-current={item === page ? 'page' : undefined}
          className={cn(
            'grid size-10 place-items-center rounded-md border text-small font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            item === page ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-foreground hover:border-primary/30',
          )}
          onClick={() => onPage(item)}
        >
          {item}
        </button>
      ))}
      <PageButton disabled={page === pageCount} onClick={() => onPage(page + 1)}>
        Next
        <ChevronRight size={16} aria-hidden="true" />
      </PageButton>
    </nav>
  )
}

function PageButton({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-10 items-center gap-1 rounded-md border border-border bg-surface px-3 text-small font-semibold text-foreground transition hover:border-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
