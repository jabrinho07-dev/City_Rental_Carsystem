const tones = {
  Available: 'bg-success/10 text-success',
  Reserved: 'bg-warning/15 text-warning',
  Rented: 'bg-secondary/10 text-secondary',
  Maintenance: 'bg-danger/10 text-danger',
  Inactive: 'bg-muted/15 text-muted',
}

export function VehicleStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ${tones[status] || tones.Inactive}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
