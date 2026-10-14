const cards = [
  { key: 'total', label: 'Total Bookings' },
  { key: 'pending', label: 'Pending Requests' },
  { key: 'confirmed', label: 'Confirmed Bookings' },
  { key: 'active', label: 'Active Rentals' },
  { key: 'completed', label: 'Completed Rentals' },
  { key: 'cancelledOrRejected', label: 'Cancelled or Rejected' },
]

export function BookingStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-caption font-medium text-muted">{card.label}</p>
          <p className="text-h2 mt-2 text-foreground">{stats?.[card.key] ?? 0}</p>
          {card.key === 'cancelledOrRejected' ? (
            <p className="mt-1 text-caption text-muted">
              {stats?.cancelled ?? 0} cancelled, {stats?.rejected ?? 0} rejected
            </p>
          ) : null}
        </article>
      ))}
    </div>
  )
}
