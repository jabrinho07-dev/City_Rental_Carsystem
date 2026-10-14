export function SettingsSection({ title, description, children }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <h2 className="text-h3 text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-small text-muted">{description}</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}
