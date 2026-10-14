import { MaintenanceActions } from '@/components/admin/maintenance/MaintenanceActions'
import { MaintenancePriorityBadge } from '@/components/admin/maintenance/MaintenancePriorityBadge'
import { MaintenanceStatusBadge } from '@/components/admin/maintenance/MaintenanceStatusBadge'
import { formatMediumDate } from '@/utils/customerFormat'
import { costLabel, formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function MaintenanceTable({ records, onView, onEdit, onStart, onComplete, onCancel }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface shadow-card lg:block">
      <table className="w-full min-w-[68rem] border-collapse text-left">
        <caption className="sr-only">Maintenance records</caption>
        <thead className="bg-canvas text-caption font-semibold tracking-wide text-muted uppercase">
          <tr>
            {['Reference', 'Vehicle', 'Service type', 'Scheduled', 'Priority', 'Cost', 'Status', 'Actions'].map((heading) => (
              <th key={heading} scope="col" className="px-3 py-3 font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-t border-border">
              <th scope="row" className="px-3 py-3 text-small font-semibold text-foreground">{record.reference}</th>
              <td className="px-3 py-3 text-small text-foreground">
                {record.vehicleName}
                {record.overdue ? <span className="mt-1 block text-caption font-semibold text-danger">Overdue</span> : null}
              </td>
              <td className="px-3 py-3 text-small text-foreground">{record.maintenanceType}</td>
              <td className="px-3 py-3 text-small text-foreground">{formatMediumDate(record.scheduledDate)}</td>
              <td className="px-3 py-3"><MaintenancePriorityBadge priority={record.priority} /></td>
              <td className="px-3 py-3 text-small text-foreground">
                {formatMaintenanceMoney(record.totalCost)}
                <span className="mt-1 block text-caption text-muted">{costLabel(record)}</span>
              </td>
              <td className="px-3 py-3"><MaintenanceStatusBadge status={record.status} /></td>
              <td className="px-3 py-3">
                <MaintenanceActions
                  record={record}
                  onView={onView}
                  onEdit={onEdit}
                  onStart={onStart}
                  onComplete={onComplete}
                  onCancel={onCancel}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
