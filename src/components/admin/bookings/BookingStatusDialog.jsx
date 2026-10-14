import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { allowedTransitions } from '@/services/bookingService'

const explanations = {
  Confirmed: 'Confirming this booking changes it to Confirmed. Payment status stays as it is.',
  Rejected: 'Rejecting this booking changes it to Rejected. This cannot be undone here.',
  Active: 'Starting this rental changes it to Active.',
  Completed: 'Completing this rental changes it to Completed.',
  Cancelled: 'Cancelling this booking changes it to Cancelled.',
}

export function BookingStatusDialog({ booking, loading, error, onClose, onConfirm }) {
  const options = booking ? allowedTransitions(booking.status).filter((status) => status !== 'Cancelled') : []
  const [nextStatus, setNextStatus] = useState(options[0] || '')
  const current = nextStatus || options[0]

  return (
    <Modal open={Boolean(booking)} title="Update booking status" onClose={onClose}>
      {booking ? (
        <div className="space-y-4">
          <p className="text-small text-foreground">
            {booking.bookingReference} is {booking.status}. {explanations[current]}
          </p>
          <Select
            id="next-booking-status"
            label="New status"
            value={current}
            onChange={(event) => setNextStatus(event.target.value)}
            options={options.map((value) => ({ value, label: value }))}
          />
          {error ? (
            <p className="text-small text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={() => onConfirm(current)} loading={loading} disabled={!current}>
              Confirm
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
