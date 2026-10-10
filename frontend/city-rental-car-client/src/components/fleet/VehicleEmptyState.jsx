import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function VehicleEmptyState({ onClear }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-14 text-center">
      <SearchX className="mx-auto text-muted" size={28} aria-hidden="true" />
      <h2 className="mt-4 text-h3 text-foreground">No vehicles found</h2>
      <p className="mx-auto mt-2 max-w-md text-small leading-6 text-muted">
        We couldn&apos;t find any vehicles matching your current filters. Try adjusting your search or filters.
      </p>
      <div className="mt-6">
        <Button type="button" variant="outline" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
