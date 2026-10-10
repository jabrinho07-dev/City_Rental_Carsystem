export function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.16em] text-brass-deep uppercase">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-muted">{description}</p> : null}
    </header>
  )
}
