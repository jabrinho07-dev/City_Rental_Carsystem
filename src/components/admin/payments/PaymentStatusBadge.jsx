import { Badge } from '@/components/ui/Badge'

const views = {
  Paid: { label: 'Paid', variant: 'paid' },
  Pending: { label: 'Pending', variant: 'pending' },
  Failed: { label: 'Failed', variant: 'unpaid' },
  Cancelled: { label: 'Cancelled', variant: 'cancelled' },
  Refunded: { label: 'Refunded', variant: 'completed' },
  'Partially Refunded': { label: 'Partially Refunded', variant: 'pending' },
}

export function PaymentStatusBadge({ status }) {
  const view = views[status] || { label: status || 'Unknown', variant: 'pending' }
  return <Badge variant={view.variant}>{view.label}</Badge>
}
