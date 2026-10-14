import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export function VehicleDeleteDialog({ vehicle, loading, onCancel, onConfirm }) {
  return (
    <Modal open={Boolean(vehicle)} title="Delete vehicle" onClose={onCancel}>
      {vehicle ? (
        <div className="mt-4 space-y-5">
          <p className="text-body text-foreground">
            Delete {vehicle.brand} {vehicle.model}? This removes it from the fleet list. This preview does not check existing bookings.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} loading={loading}>
              Confirm Delete
            </Button>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}
