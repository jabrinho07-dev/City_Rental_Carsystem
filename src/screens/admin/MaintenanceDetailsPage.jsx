import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@/lib/router'
import { MaintenanceActions } from '@/components/admin/maintenance/MaintenanceActions'
import { MaintenanceConfirmDialog } from '@/components/admin/maintenance/MaintenanceConfirmDialog'
import { MaintenancePriorityBadge } from '@/components/admin/maintenance/MaintenancePriorityBadge'
import { MaintenanceStatusBadge } from '@/components/admin/maintenance/MaintenanceStatusBadge'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { formatMediumDate } from '@/utils/customerFormat'
import { costLabel, formatMaintenanceMoney } from '@/utils/maintenanceCalculations'
import {
  MaintenanceError,
  cancelMaintenance,
  getMaintenanceById,
  updateMaintenanceStatus,
} from '@/services/maintenanceService'

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-border py-2 text-small">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}

export default function MaintenanceDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState(null)
  const [missing, setMissing] = useState(false)
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const found = await getMaintenanceById(id)
    if (!found) {
      setMissing(true)
      setRecord(null)
      return
    }
    setMissing(false)
    setRecord(found)
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('city-rental-car.maintenance-notice')
    if (stored) {
      setNotice(stored)
      sessionStorage.removeItem('city-rental-car.maintenance-notice')
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function confirm(values) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = dialog === 'cancel'
        ? await cancelMaintenance(record.id, values.reason)
        : await updateMaintenanceStatus(record.id, dialog === 'start' ? 'In Progress' : 'Completed', values)
      setDialog(null)
      setNotice(`${saved.record.reference} is now ${saved.record.status}. ${saved.availabilityNote}`)
      await load()
    } catch (error) {
      setDialogError(error instanceof MaintenanceError ? error.message : 'The maintenance status could not be changed.')
    } finally {
      setSaving(false)
    }
  }

  if (missing) {
    return (
      <div className="space-y-4">
        <h1 className="text-h2 text-foreground">Maintenance record not found</h1>
        <Button to={routes.admin.maintenance}>Return to maintenance</Button>
      </div>
    )
  }

  if (!record) return <p className="text-small text-muted">Loading maintenance record…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">{record.reference}</h1>
          <p className="mt-1 text-small text-muted">{record.title}</p>
        </div>
        <div className="flex gap-2">
          <MaintenancePriorityBadge priority={record.priority} />
          <MaintenanceStatusBadge status={record.status} />
        </div>
      </div>
      {record.overdue ? <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger">This job is overdue.</p> : null}
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Vehicle</h2>
        {record.vehicleMissing ? (
          <p className="mt-2 text-small text-muted">This vehicle is no longer in the fleet. The maintenance record was kept.</p>
        ) : (
          <dl>
            <Row label="Vehicle" value={record.vehicleName} />
            <Row label="Registration" value={record.vehicleRegistration || 'Not on file'} />
            <Row label="Current vehicle status" value={record.vehicleStatus || '—'} />
          </dl>
        )}
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Service</h2>
        <dl>
          <Row label="Type" value={record.maintenanceType} />
          <Row label="Description" value={record.description} />
          <Row label="Scheduled date" value={formatMediumDate(record.scheduledDate)} />
          <Row label="Provider" value={record.serviceProvider} />
          <Row label="Odometer" value={record.odometer ?? '—'} />
          <Row label="Started" value={record.startedAt ? formatMediumDate(record.startedAt.slice(0, 10)) : '—'} />
          <Row label="Completed" value={record.completedAt ? formatMediumDate(record.completedAt.slice(0, 10)) : '—'} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Cost</h2>
        <dl>
          <Row label="Parts" value={formatMaintenanceMoney(record.partsCost)} />
          <Row label="Labor" value={formatMaintenanceMoney(record.laborCost)} />
          <Row label="Other" value={formatMaintenanceMoney(record.otherCost)} />
          <Row label={`${costLabel(record)} total`} value={`${formatMaintenanceMoney(record.totalCost)} USD`} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Notes</h2>
        <dl>
          <Row label="Parts replaced" value={record.partsReplaced.length ? record.partsReplaced.join(', ') : '—'} />
          <Row label="Notes" value={record.notes || '—'} />
          <Row label="Next service date" value={record.nextServiceDate ? formatMediumDate(record.nextServiceDate) : '—'} />
          <Row label="Created" value={formatMediumDate(record.createdAt.slice(0, 10))} />
          <Row label="Updated" value={formatMediumDate(record.updatedAt.slice(0, 10))} />
        </dl>
      </section>
      <MaintenanceActions
        record={record}
        onView={() => navigate(routes.admin.maintenanceRecord(record.id))}
        onEdit={() => navigate(routes.admin.editMaintenance(record.id))}
        onStart={() => setDialog('start')}
        onComplete={() => setDialog('complete')}
        onCancel={() => setDialog('cancel')}
      />
      <Button variant="outline" to={routes.admin.maintenance}>Return to maintenance</Button>
      <MaintenanceConfirmDialog
        mode={dialog}
        record={dialog ? record : null}
        loading={saving}
        error={dialogError}
        onClose={() => setDialog(null)}
        onConfirm={confirm}
      />
    </div>
  )
}
