export function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="h-full rounded-lg border border-border bg-surface p-6 shadow-card transition duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-float">
      <span className="grid size-10 place-items-center rounded-md bg-canvas text-primary">
        <Icon size={18} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-h3 text-foreground">{title}</h3>
      <p className="mt-2 text-small leading-6 text-muted">{text}</p>
    </article>
  )
}
