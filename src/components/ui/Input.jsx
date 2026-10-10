import { forwardRef } from 'react'
import { Field } from '@/components/ui/Field'
import { controlClass, controlHeight } from '@/components/ui/controlStyles'
import { cn } from '@/utils/cn'

export const Input = forwardRef(function Input(
  { id, label, error, hint, className, ...props },
  ref,
) {
  const control = (describedBy) => (
    <input
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(controlClass, controlHeight, className)}
      {...props}
    />
  )

  if (!label && !error && !hint) return control()

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      {control}
    </Field>
  )
})
