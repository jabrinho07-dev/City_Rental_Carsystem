import { Button } from '@/components/ui/Button'

export function ExpenseActions({ expense, canApprove, onView, onEdit, onApprove, onReject }) {
  const pending = expense.approvalStatus === 'Pending'
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onView(expense)}>View details</Button>
      <Button size="sm" variant="outline" onClick={() => onEdit(expense)}>Edit</Button>
      {canApprove && pending ? <Button size="sm" onClick={() => onApprove(expense)}>Approve</Button> : null}
      {canApprove && pending ? <Button size="sm" variant="danger" onClick={() => onReject(expense)}>Reject</Button> : null}
    </div>
  )
}
