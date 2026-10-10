import { VehicleSort } from '@/components/fleet/VehicleSort'

export function FleetResultsHeader({ count, sort, onSort, showSort = true }) {
  const label = count === 1 ? '1 Vehicle Available' : `${count} Vehicles Available`

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-h3 text-foreground">{label}</h2>
      {showSort ? (
        <div className="hidden w-full lg:block lg:max-w-xs">
          <VehicleSort value={sort} onChange={onSort} />
        </div>
      ) : null}
    </div>
  )
}
