import { MaintenanceActions } from '@/components/admin/maintenance/MaintenanceActions'
import { MaintenancePriorityBadge } from '@/components/admin/maintenance/MaintenancePriorityBadge'
import { MaintenanceStatusBadge } from '@/components/admin/maintenance/MaintenanceStatusBadge'
import { formatMediumDate } from '@/utils/customerFormat'
import { costLabel, formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function MaintenanceMobileCards({ records, onView, onEdit, onStart, onComplete, onCancel }) {
  return (
    <div className="grid gap-3 lg:hidden">
      {records.map((record) => (
        <article key={record.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-small font-semibold text-foreground">{record.reference}</h3>
              <p className="text-caption text-muted">{record.vehicleName}</p>
            </div>
            <MaintenanceStatusBadge status={record.status} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-small">
            <div>
              <dt className="text-caption text-muted">Service</dt>
              <dd>{record.maintenanceType}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Scheduled</dt>
              <dd>{formatMediumDate(record.scheduledDate)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Priority</dt>
              <dd><MaintenancePriorityBadge priority={record.priority} /></dd>
            </div>
            <div>
              <dt className="text-caption text-muted">{costLabel(record)} cost</dt>
              <dd className="font-semibold">{formatMaintenanceMoney(record.totalCost)}</dd>
            </div>
          </dl>
          {record.overdue ? <p className="mt-2 text-caption font-semibold text-danger">Overdue</p> : null}
          <div className="mt-3">
            <MaintenanceActions
              record={record}
              onView={onView}
              onEdit={onEdit}
              onStart={onStart}
              onComplete={onComplete}
              onCancel={onCancel}
            />
          </div>
        </article>
      ))}
    </div>
  )
}
