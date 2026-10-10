import { cn } from '@/utils/cn'

const variants = {
  available: 'bg-success/10 text-success',
  reserved: 'bg-warning/15 text-warning',
  rented: 'bg-secondary/10 text-secondary',
  maintenance: 'bg-danger/10 text-danger',
  pending: 'bg-warning/15 text-warning',
  confirmed: 'bg-success/10 text-success',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-danger/10 text-danger',
  paid: 'bg-success/10 text-success',
  unpaid: 'bg-danger/10 text-danger',
}

export function Badge({ variant = 'available', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold',
        variants[variant],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}
