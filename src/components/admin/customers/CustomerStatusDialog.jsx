import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { customerStatuses } from '@/services/customerService'

export function CustomerStatusDialog({ customer, loading, error, onClose, onConfirm }) {
  const [status, setStatus] = useState(customer?.status || 'Active')
  const suspending = status === 'Suspended' && customer?.openBookings > 0
  return (
    <Modal open={Boolean(customer)} title="Change account status" onClose={onClose}>
      {customer ? (
        <div className="mt-3 space-y-3">
          <p className="text-small text-muted">
            {customer.name} is currently {customer.status}. This does not change booking or payment records.
          </p>
          <label className="block text-small font-medium text-foreground" htmlFor="next-customer-status">
            New status
            <select id="next-customer-status" className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3" value={status} onChange={(event) => setStatus(event.target.value)}>
              {customerStatuses.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          {suspending ? (
            <p className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-small text-foreground" role="status">
              This customer has {customer.openBookings} open booking{customer.openBookings === 1 ? '' : 's'}. Suspending the account will not cancel those bookings or change payments.
            </p>
          ) : null}
          {error ? <p className="text-small text-danger" role="alert">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Back</Button>
            <Button variant={status === 'Suspended' ? 'danger' : 'primary'} loading={loading} onClick={() => onConfirm(status)}>Save status</Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
