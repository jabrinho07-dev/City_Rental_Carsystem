import { forwardRef } from 'react'
import { Field } from '@/components/ui/Field'
import { controlClass, controlHeight } from '@/components/ui/controlStyles'
import { cn } from '@/utils/cn'

export const Select = forwardRef(function Select(
  { id, label, error, hint, options = [], placeholder, className, children, ...props },
  ref,
) {
  const control = (describedBy) => (
    <select
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(controlClass, controlHeight, className)}
      {...props}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
      {children}
    </select>
  )

  if (!label && !error && !hint) return control()

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      {control}
    </Field>
  )
})
