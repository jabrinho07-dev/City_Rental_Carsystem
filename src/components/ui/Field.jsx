export function Field({ id, label, error, hint, children }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={id} className="block text-small font-medium text-foreground">
          {label}
        </label>
      ) : null}
      {typeof children === 'function' ? children(describedBy) : children}
      {error ? (
        <p id={`${id}-error`} className="text-caption text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
