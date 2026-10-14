const tones = {
  Active: 'bg-success/10 text-success',
  Inactive: 'bg-canvas text-muted',
  Suspended: 'bg-danger/10 text-danger',
}

export function CustomerStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold ${tones[status] || tones.Inactive}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
