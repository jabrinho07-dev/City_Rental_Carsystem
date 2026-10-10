import { Badge } from '@/components/ui/Badge'

export function BookingCard({ reference, vehicle, dates, status, statusLabel, amount }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-caption text-muted">{reference}</p>
          <h3 className="mt-1 text-h3 text-foreground">{vehicle}</h3>
        </div>
        <Badge variant={status}>{statusLabel}</Badge>
      </div>
      <dl className="mt-4 grid gap-2 text-small sm:grid-cols-2">
        <div>
          <dt className="text-muted">Dates</dt>
          <dd className="font-medium text-foreground">{dates}</dd>
        </div>
        <div>
          <dt className="text-muted">Amount</dt>
          <dd className="font-medium text-foreground">{amount}</dd>
        </div>
      </dl>
    </article>
  )
}
