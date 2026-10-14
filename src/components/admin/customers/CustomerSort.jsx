export function CustomerSort({ value, pageSize, onChange, onPageSize }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-small font-medium text-foreground" htmlFor="customer-sort">
        Sort
        <select id="customer-sort" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="newest">Newest customers</option>
          <option value="oldest">Oldest customers</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="spent">Highest collected payments</option>
          <option value="bookings">Most linked bookings</option>
        </select>
      </label>
      <label className="text-small font-medium text-foreground" htmlFor="customer-page-size">
        Page size
        <select id="customer-page-size" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={pageSize} onChange={(event) => onPageSize(Number(event.target.value))}>
          {[4, 6, 10].map((size) => (
            <option key={size} value={size}>{size} per page</option>
          ))}
        </select>
      </label>
    </div>
  )
}
