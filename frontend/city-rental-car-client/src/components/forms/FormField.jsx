export function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  )
}
