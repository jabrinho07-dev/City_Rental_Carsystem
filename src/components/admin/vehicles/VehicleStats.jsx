const cards = [
  { key: 'total', label: 'Total Vehicles' },
  { key: 'available', label: 'Available Vehicles' },
  { key: 'reserved', label: 'Reserved Vehicles' },
  { key: 'rented', label: 'Currently Rented' },
  { key: 'maintenance', label: 'Under Maintenance' },
]

export function VehicleStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <article key={card.key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-caption font-medium text-muted">{card.label}</p>
          <p className="text-h2 mt-2 text-foreground">{stats?.[card.key] ?? 0}</p>
        </article>
      ))}
    </div>
  )
}
