import { X } from 'lucide-react'
import { formatPricePerDay } from '@/constants/mockVehicles'

const availabilityLabel = {
  available: 'Available',
  reserved: 'Reserved',
  rented: 'Rented',
  maintenance: 'Maintenance',
}

export function ActiveFilters({ query, onRemove, onClear }) {
  const chips = []

  if (query.search) chips.push({ key: 'search', label: `Search: ${query.search}` })
  if (query.category) chips.push({ key: 'category', label: query.category })
  if (query.transmission) chips.push({ key: 'transmission', label: query.transmission })
  if (query.fuel) chips.push({ key: 'fuel', label: query.fuel })
  if (query.seats) chips.push({ key: 'seats', label: `${query.seats}+ seats` })
  if (query.availability) chips.push({ key: 'availability', label: availabilityLabel[query.availability] || query.availability })
  if (query.minPrice || query.maxPrice) {
    const min = query.minPrice ? formatPricePerDay(Number(query.minPrice)) : 'Any'
    const max = query.maxPrice ? formatPricePerDay(Number(query.maxPrice)) : 'Any'
    chips.push({ key: 'price', label: `${min} – ${max}` })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-caption font-semibold text-foreground transition hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => onRemove(chip.key)}
        >
          {chip.label}
          <X size={14} aria-hidden="true" />
          <span className="sr-only">Remove {chip.label}</span>
        </button>
      ))}
      <button
        type="button"
        className="rounded-md px-2 py-1 text-caption font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={onClear}
      >
        Clear All
      </button>
    </div>
  )
}
