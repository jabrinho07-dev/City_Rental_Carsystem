import { Button } from '@/components/ui/Button'

export function MaintenanceActions({ record, onView, onEdit, onStart, onComplete, onCancel }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onView(record)}>View details</Button>
      <Button size="sm" variant="outline" onClick={() => onEdit(record)}>Edit record</Button>
      {record.status === 'Scheduled' ? (
        <Button size="sm" onClick={() => onStart(record)}>Start maintenance</Button>
      ) : null}
      {record.status === 'In Progress' ? (
        <Button size="sm" variant="secondary" onClick={() => onComplete(record)}>Complete maintenance</Button>
      ) : null}
      {record.status === 'Scheduled' ? (
        <Button size="sm" variant="danger" onClick={() => onCancel(record)}>Cancel</Button>
      ) : null}
    </div>
  )
}
