import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { formatMaintenanceMoney, totalCost } from '@/utils/maintenanceCalculations'

const copy = {
  start: {
    title: 'Start maintenance',
    body: 'This records a start time and moves the job to In Progress. The vehicle status changes only when that is safe.',
  },
  complete: {
    title: 'Complete maintenance',
    body: 'This records the completion time and the final cost. The original job stays on record.',
  },
  cancel: {
    title: 'Cancel maintenance',
    body: 'Only a scheduled job can be cancelled. Completed work cannot be reopened here.',
  },
}

export function MaintenanceConfirmDialog({ mode, record, loading, error, onClose, onConfirm }) {
  const [reason, setReason] = useState('')
  const [partsCost, setPartsCost] = useState('0')
  const [laborCost, setLaborCost] = useState('0')
  const [otherCost, setOtherCost] = useState('0')
  const [notes, setNotes] = useState('')
  const text = copy[mode] || copy.start
  const finalCost = totalCost(partsCost, laborCost, otherCost)

  useEffect(() => {
    if (!record) return
    setReason('')
    setPartsCost(String(record.partsCost ?? 0))
    setLaborCost(String(record.laborCost ?? 0))
    setOtherCost(String(record.otherCost ?? 0))
    setNotes(record.notes || '')
  }, [record, mode])

  return (
    <Modal open={Boolean(record && mode)} title={text.title} onClose={onClose}>
      {record ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (mode === 'cancel') onConfirm({ reason })
            else if (mode === 'complete') onConfirm({ partsCost, laborCost, otherCost, notes })
            else onConfirm({})
          }}
        >
          <p className="text-small text-muted">{text.body}</p>
          <p className="text-small text-foreground">{record.reference} · {record.vehicleName}</p>
          {mode === 'complete' ? (
            <>
              <Input id="final-parts" label="Final parts cost (USD)" type="number" min="0" step="0.01" value={partsCost} onChange={(event) => setPartsCost(event.target.value)} />
              <Input id="final-labor" label="Final labor cost (USD)" type="number" min="0" step="0.01" value={laborCost} onChange={(event) => setLaborCost(event.target.value)} />
              <Input id="final-other" label="Final other cost (USD)" type="number" min="0" step="0.01" value={otherCost} onChange={(event) => setOtherCost(event.target.value)} />
              <p className="text-small text-foreground">Final recorded total {finalCost === null ? '—' : formatMaintenanceMoney(finalCost)} USD</p>
              <Textarea id="final-notes" label="Completion notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
            </>
          ) : null}
          {mode === 'cancel' ? (
            <Input id="cancel-reason" label="Reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          ) : null}
          {error ? <p className="text-small text-danger" role="alert">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Back</Button>
            <Button type="submit" variant={mode === 'cancel' ? 'danger' : 'primary'} loading={loading}>
              Confirm
            </Button>
          </div>
        </form>
      ) : null}
    </Modal>
  )
}
