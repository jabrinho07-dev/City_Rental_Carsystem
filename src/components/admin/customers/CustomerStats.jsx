const cards = [
  ['total', 'Total customers'],
  ['active', 'Active'],
  ['inactive', 'Inactive'],
  ['newThisMonth', 'New this month'],
]

export function CustomerStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([key, label]) => (
        <article key={key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-caption font-semibold tracking-wide text-muted uppercase">{label}</p>
          <p className="mt-2 text-h2 text-foreground">{stats ? stats[key] : '—'}</p>
        </article>
      ))}
    </div>
  )
}
