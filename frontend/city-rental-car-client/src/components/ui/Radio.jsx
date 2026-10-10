import { Field } from '@/components/ui/Field'

export function Radio({ id, label, hint, error, className, ...props }) {
  return (
    <Field id={id} error={error} hint={hint}>
      {(describedBy) => (
        <label htmlFor={id} className="flex items-start gap-3 text-small text-foreground">
          <input
            id={id}
            type="radio"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={`mt-0.5 size-4 accent-primary disabled:cursor-not-allowed ${className || ''}`}
            {...props}
          />
          <span>{label}</span>
        </label>
      )}
    </Field>
  )
}
