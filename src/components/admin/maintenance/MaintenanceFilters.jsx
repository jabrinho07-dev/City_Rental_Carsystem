import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { maintenancePriorities, maintenanceStatuses, maintenanceTypes } from '@/validators/maintenanceSchema'

export function MaintenanceFilters({ filters, vehicles, onChange, onReset, activeCount }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          id="maintenance-status"
          label="Status"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
          placeholder="All statuses"
          options={maintenanceStatuses.map((status) => ({ value: status, label: status }))}
        />
        <Select
          id="maintenance-type"
          label="Maintenance type"
          value={filters.type}
          onChange={(event) => onChange({ ...filters, type: event.target.value })}
          placeholder="All types"
          options={maintenanceTypes.map((type) => ({ value: type, label: type }))}
        />
        <Select
          id="maintenance-priority"
          label="Priority"
          value={filters.priority}
          onChange={(event) => onChange({ ...filters, priority: event.target.value })}
          placeholder="All priorities"
          options={maintenancePriorities.map((priority) => ({ value: priority, label: priority }))}
        />
        <Select
          id="maintenance-vehicle"
          label="Vehicle"
          value={filters.vehicleId}
          onChange={(event) => onChange({ ...filters, vehicleId: event.target.value })}
          placeholder="All vehicles"
          options={vehicles.map((vehicle) => ({ value: vehicle.id, label: `${vehicle.brand} ${vehicle.model}` }))}
        />
        <label className="text-caption font-medium text-foreground" htmlFor="maintenance-from">
          Scheduled from
          <input
            id="maintenance-from"
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small"
          />
        </label>
        <label className="text-caption font-medium text-foreground" htmlFor="maintenance-to">
          Scheduled to
          <input
            id="maintenance-to"
            type="date"
            value={filters.dateTo}
            onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
            className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small"
          />
        </label>
      </div>
      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-caption text-muted">{activeCount} active filters</p>
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}
