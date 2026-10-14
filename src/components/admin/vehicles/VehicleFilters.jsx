import { Select } from '@/components/ui/Select'
import { fuelOptions, transmissionOptions, vehicleCategories, vehicleStatuses } from '@/validators/vehicleSchema'

const sorts = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price-asc', label: 'Daily price: low to high' },
  { value: 'price-desc', label: 'Daily price: high to low' },
  { value: 'name', label: 'Brand and model' },
]

export function VehicleFilters({ filters, onChange, onReset, active }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Select
          id="vehicle-category"
          label="Category"
          value={filters.category}
          onChange={(event) => onChange('category', event.target.value)}
          placeholder="All categories"
          options={vehicleCategories.map((value) => ({ value, label: value }))}
        />
        <Select
          id="vehicle-status"
          label="Status"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
          placeholder="All statuses"
          options={vehicleStatuses.map((value) => ({ value, label: value }))}
        />
        <Select
          id="vehicle-transmission"
          label="Transmission"
          value={filters.transmission}
          onChange={(event) => onChange('transmission', event.target.value)}
          placeholder="All transmissions"
          options={transmissionOptions.map((value) => ({ value, label: value }))}
        />
        <Select
          id="vehicle-fuel"
          label="Fuel type"
          value={filters.fuel}
          onChange={(event) => onChange('fuel', event.target.value)}
          placeholder="All fuel types"
          options={fuelOptions.map((value) => ({ value, label: value }))}
        />
        <Select
          id="vehicle-sort"
          label="Sort"
          value={filters.sort}
          onChange={(event) => onChange('sort', event.target.value)}
          options={sorts}
        />
      </div>
      {active.length ? (
        <div className="flex flex-wrap items-center gap-2">
          {active.map((item) => (
            <span key={item} className="rounded-full border border-border bg-canvas px-2.5 py-1 text-caption font-medium text-foreground">
              {item}
            </span>
          ))}
          <button
            type="button"
            className="rounded-md px-2 py-1 text-caption font-semibold text-primary hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={onReset}
          >
            Reset filters
          </button>
        </div>
      ) : null}
    </div>
  )
}
