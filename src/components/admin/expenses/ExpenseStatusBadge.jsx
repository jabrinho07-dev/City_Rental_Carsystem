import { Badge } from '@/components/ui/Badge'

const approval = {
  Pending: { label: 'Pending', variant: 'pending' },
  Approved: { label: 'Approved', variant: 'paid' },
  Rejected: { label: 'Rejected', variant: 'unpaid' },
}

const payment = {
  Unpaid: { label: 'Unpaid', variant: 'pending' },
  Paid: { label: 'Paid', variant: 'paid' },
  'Partially Paid': { label: 'Partially Paid', variant: 'reserved' },
  Cancelled: { label: 'Cancelled', variant: 'cancelled' },
}

export function ExpenseApprovalBadge({ status }) {
  const view = approval[status] || { label: status || 'Unknown', variant: 'pending' }
  return <Badge variant={view.variant}>{view.label}</Badge>
}

export function ExpensePaymentBadge({ status }) {
  const view = payment[status] || { label: status || 'Unknown', variant: 'pending' }
  return <Badge variant={view.variant}>{view.label}</Badge>
}
