export function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-caption font-semibold tracking-[0.12em] text-muted uppercase">{label}</p>
        {Icon ? <Icon size={18} className="text-accent" aria-hidden="true" /> : null}
      </div>
      <p className="mt-3 text-h2 text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-small text-muted">{hint}</p> : null}
    </article>
  )
}
