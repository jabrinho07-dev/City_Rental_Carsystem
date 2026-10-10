import { forwardRef } from 'react'
import { Field } from '@/components/ui/Field'
import { controlClass } from '@/components/ui/controlStyles'
import { cn } from '@/utils/cn'

export const Textarea = forwardRef(function Textarea(
  { id, label, error, hint, className, ...props },
  ref,
) {
  const control = (describedBy) => (
    <textarea
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(controlClass, 'min-h-32 resize-y py-3', className)}
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
