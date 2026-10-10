import { Search } from 'lucide-react'
import { forwardRef } from 'react'
import { Field } from '@/components/ui/Field'
import { controlClass, controlHeight } from '@/components/ui/controlStyles'
import { cn } from '@/utils/cn'

export const SearchInput = forwardRef(function SearchInput(
  { id, label, error, hint, className, ...props },
  ref,
) {
  const control = (describedBy) => (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted" size={16} aria-hidden="true" />
      <input
        ref={ref}
        id={id}
        type="search"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(controlClass, controlHeight, 'pl-9', className)}
        {...props}
      />
    </div>
  )

  if (!label && !error && !hint) return control()

  return (
    <Field id={id} label={label} error={error} hint={hint}>
      {control}
    </Field>
  )
})
