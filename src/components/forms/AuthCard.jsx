export function FormNotice({ children }) {
  return (
    <p className="rounded-lg border border-line bg-sand px-3 py-2.5 text-sm leading-6 text-ink-soft" role="status">
      {children}
    </p>
  )
}

export function AuthCard({ title, description, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <header>
        <p className="text-xs font-semibold tracking-[0.16em] text-brass-deep uppercase">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      </header>
      <div className="mt-6 rounded-2xl border border-line bg-paper p-6 shadow-sm sm:p-8">{children}</div>
      {footer ? <div className="mt-5 text-sm text-muted">{footer}</div> : null}
    </div>
  )
}
