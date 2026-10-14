import { Link } from '@/lib/router'
import { MaintenancePriorityBadge } from '@/components/admin/maintenance/MaintenancePriorityBadge'
import { MaintenanceStatusBadge } from '@/components/admin/maintenance/MaintenanceStatusBadge'
import { routes } from '@/constants/routes'
import { formatMediumDate } from '@/utils/customerFormat'

export function UpcomingMaintenance({ records }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <h2 className="text-h3 text-foreground">Upcoming maintenance</h2>
      <p className="mt-1 text-caption text-muted">Overdue jobs stay in this list until they are completed or cancelled.</p>
      {records.length === 0 ? (
        <p className="mt-4 text-small text-muted">No scheduled or in-progress maintenance.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {records.map((record) => (
            <li key={record.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <Link to={routes.admin.maintenanceRecord(record.id)} className="text-small font-semibold text-foreground underline">
                  {record.vehicleName}
                </Link>
                <p className="text-caption text-muted">
                  {record.maintenanceType} · {formatMediumDate(record.scheduledDate)}
                  {record.overdue ? ' · Overdue' : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <MaintenancePriorityBadge priority={record.priority} />
                <MaintenanceStatusBadge status={record.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
