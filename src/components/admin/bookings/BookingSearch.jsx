import { X } from 'lucide-react'
import { SearchInput } from '@/components/ui/SearchInput'

export function BookingSearch({ value, onChange }) {
  return (
    <div className="relative">
      <SearchInput
        id="booking-search"
        label="Search bookings"
        placeholder="Reference, customer, or vehicle"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="absolute top-9 right-2 grid size-8 place-items-center rounded-md text-muted hover:bg-canvas hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
