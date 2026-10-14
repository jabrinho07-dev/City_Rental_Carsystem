import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'

export function BookingCancelDialog({ booking, loading, error, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <Modal open={Boolean(booking)} title="Cancel booking" onClose={onClose}>
      {booking ? (
        <div className="space-y-4">
          <p className="text-small text-foreground">
            Cancel {booking.bookingReference} for {booking.customer.name}? The booking becomes Cancelled and the saved total stays unchanged.
          </p>
          <Textarea id="cancel-reason" label="Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          {error ? (
            <p className="text-small text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => onConfirm(reason)} loading={loading}>
              Confirm cancellation
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
