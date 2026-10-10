import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Field } from '@/components/ui/Field'
import { controlClass, controlHeight } from '@/components/ui/controlStyles'
import { cn } from '@/utils/cn'

export function PasswordField({ id, label, error, className, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <Field id={id} label={label} error={error}>
      {(describedBy) => (
        <div className="relative">
          <input
            id={id}
            type={visible ? 'text' : 'password'}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(controlClass, controlHeight, 'pr-11', className)}
            {...props}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        </div>
      )}
    </Field>
  )
}
