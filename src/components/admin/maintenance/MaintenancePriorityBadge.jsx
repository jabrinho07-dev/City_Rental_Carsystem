import { Badge } from '@/components/ui/Badge'

const views = {
  Low: { label: 'Low', variant: 'completed' },
  Medium: { label: 'Medium', variant: 'pending' },
  High: { label: 'High', variant: 'reserved' },
  Urgent: { label: 'Urgent', variant: 'unpaid' },
}

export function MaintenancePriorityBadge({ priority }) {
  const view = views[priority] || { label: priority || 'Unknown', variant: 'pending' }
  return <Badge variant={view.variant}>{view.label}</Badge>
}
