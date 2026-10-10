import { Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export function BookingStepper({ steps, current, onSelect }) {
  const active = steps[current - 1]

  return (
    <nav aria-label="Booking progress">
      <div className="md:hidden">
        <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">
          Step {current} of {steps.length}
        </p>
        <p className="mt-1 text-h3 text-foreground">{active?.label}</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
          <div className="h-full rounded-full bg-accent" style={{ width: `${(current / steps.length) * 100}%` }} />
        </div>
      </div>

      <ol className="hidden md:flex md:items-center">
        {steps.map((step, index) => {
          const number = index + 1
          const complete = number < current
          const selected = number === current
          const canSelect = complete && onSelect
          const content = (
            <>
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full border text-caption font-semibold',
                  complete && 'border-success bg-success text-white',
                  selected && 'border-primary bg-primary text-white',
                  !complete && !selected && 'border-border bg-surface text-muted',
                )}
              >
                {complete ? <Check size={16} aria-hidden="true" /> : number}
              </span>
              <span className={cn('truncate text-caption font-semibold', selected ? 'text-foreground' : 'text-muted')}>
                {step.label}
              </span>
            </>
          )

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              {canSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(number)}
                  className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {content}
                </button>
              ) : (
                <div className="flex min-w-0 items-center gap-2" aria-current={selected ? 'step' : undefined}>
                  {content}
                </div>
              )}
              {index < steps.length - 1 ? <span className="mx-1 hidden h-px min-w-3 flex-1 bg-border lg:block" aria-hidden="true" /> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
