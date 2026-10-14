import { customerStatuses } from '@/services/customerService'

export function CustomerFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <label className="text-small font-medium text-foreground" htmlFor="customer-status">
        Status
        <select id="customer-status" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">All statuses</option>
          {customerStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </label>
      <label className="text-small font-medium text-foreground" htmlFor="registered-from">
        Registered from
        <input id="registered-from" type="date" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={filters.registeredFrom} onChange={(event) => onChange('registeredFrom', event.target.value)} />
      </label>
      <label className="text-small font-medium text-foreground" htmlFor="registered-to">
        Registered to
        <input id="registered-to" type="date" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={filters.registeredTo} onChange={(event) => onChange('registeredTo', event.target.value)} />
      </label>
      <label className="text-small font-medium text-foreground" htmlFor="customer-activity">
        Booking activity
        <select id="customer-activity" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={filters.activity} onChange={(event) => onChange('activity', event.target.value)}>
          <option value="">Any activity</option>
          <option value="bookings">Has linked bookings</option>
          <option value="none">No linked bookings</option>
          <option value="open">Open rental</option>
        </select>
      </label>
    </div>
  )
}
