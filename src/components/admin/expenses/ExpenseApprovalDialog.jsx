import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export function ExpenseApprovalDialog({ mode, expense, loading, error, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  useEffect(() => {
    setReason('')
  }, [expense, mode])

  return (
    <Modal open={Boolean(expense && mode)} title={mode === 'reject' ? 'Reject expense' : 'Approve expense'} onClose={onClose}>
      {expense ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            onConfirm(mode === 'reject' ? { reason } : {})
          }}
        >
          <p className="text-small text-muted">
            This is a simulated office decision. Approving does not mark the expense as paid, and it does not move money.
          </p>
          <p className="text-small text-foreground">{expense.expenseReference} · {expense.title}</p>
          {mode === 'reject' ? <Input id="reject-reason" label="Rejection reason" value={reason} onChange={(event) => setReason(event.target.value)} /> : null}
          {error ? <p className="text-small text-danger" role="alert">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Back</Button>
            <Button type="submit" variant={mode === 'reject' ? 'danger' : 'primary'} loading={loading}>Confirm</Button>
          </div>
        </form>
      ) : null}
    </Modal>
  )
}
