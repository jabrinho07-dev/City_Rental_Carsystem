import { Badge } from '@/components/ui/Badge'

const views = {
  Scheduled: { label: 'Scheduled', variant: 'pending' },
  'In Progress': { label: 'In Progress', variant: 'maintenance' },
  Completed: { label: 'Completed', variant: 'paid' },
  Cancelled: { label: 'Cancelled', variant: 'cancelled' },
}

export function MaintenanceStatusBadge({ status }) {
  const view = views[status] || { label: status || 'Unknown', variant: 'pending' }
  return <Badge variant={view.variant}>{view.label}</Badge>
}
