import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { MaintenanceConfirmDialog } from '@/components/admin/maintenance/MaintenanceConfirmDialog'
import { MaintenanceFilters } from '@/components/admin/maintenance/MaintenanceFilters'
import { MaintenanceMobileCards } from '@/components/admin/maintenance/MaintenanceMobileCards'
import { MaintenanceSearch } from '@/components/admin/maintenance/MaintenanceSearch'
import { MaintenanceStats } from '@/components/admin/maintenance/MaintenanceStats'
import { MaintenanceTable } from '@/components/admin/maintenance/MaintenanceTable'
import { UpcomingMaintenance } from '@/components/admin/maintenance/UpcomingMaintenance'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { routes } from '@/constants/routes'
import { formatMediumDate } from '@/utils/customerFormat'
import {
  MaintenanceError,
  cancelMaintenance,
  getMaintenanceRecords,
  listMaintenanceVehicles,
  updateMaintenanceStatus,
} from '@/services/maintenanceService'

const emptyFilters = { status: '', type: '', priority: '', vehicleId: '', dateFrom: '', dateTo: '', sort: 'newest' }
const NOTICE_KEY = 'city-rental-car.maintenance-notice'
const sorts = [
  { value: 'newest', label: 'Newest record' },
  { value: 'oldest', label: 'Oldest record' },
  { value: 'upcoming', label: 'Upcoming scheduled date' },
  { value: 'priority', label: 'Highest priority' },
  { value: 'cost-desc', label: 'Highest cost' },
  { value: 'cost-asc', label: 'Lowest cost' },
]

export default function MaintenancePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load(nextPage = page) {
    setError('')
    try {
      const data = await getMaintenanceRecords({ search, ...filters, page: nextPage })
      setResult(data)
      setPage(data.page)
      setVehicles(listMaintenanceVehicles())
    } catch (loadError) {
      setError(loadError.message || 'Maintenance records could not be loaded.')
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(NOTICE_KEY)
    if (stored) {
      setNotice(stored)
      sessionStorage.removeItem(NOTICE_KEY)
    }
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters])

  const activeCount = [filters.status, filters.type, filters.priority, filters.vehicleId, filters.dateFrom, filters.dateTo].filter(Boolean).length

  function openDialog(mode, record) {
    setDialogError('')
    setDialog({ mode, record })
  }

  async function confirm(values) {
    setSaving(true)
    setDialogError('')
    try {
      const action = dialog.mode === 'cancel'
        ? cancelMaintenance(dialog.record.id, values.reason)
        : updateMaintenanceStatus(dialog.record.id, dialog.mode === 'start' ? 'In Progress' : 'Completed', values)
      const saved = await action
      setDialog(null)
      setNotice(`${saved.record.reference} is now ${saved.record.status}. ${saved.availabilityNote}`)
      await load(page)
    } catch (saveError) {
      setDialogError(saveError instanceof MaintenanceError ? saveError.message : 'The maintenance status could not be changed.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">Vehicle Maintenance</h1>
          <p className="mt-1 max-w-2xl text-small text-muted">
            Schedule service, track cost, and take a car off the rental list only when no conflicting rental status blocks that change.
          </p>
        </div>
        <Button onClick={() => navigate(routes.admin.newMaintenance)}>Add maintenance record</Button>
      </div>
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      <MaintenanceStats stats={result?.stats} />
      <UpcomingMaintenance records={result?.upcoming || []} />
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Recent maintenance activity</h2>
        {result?.recent?.length ? (
          <ul className="mt-3 divide-y divide-border">
            {result.recent.map((record) => (
              <li key={record.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-small">
                <button type="button" className="font-semibold text-foreground underline" onClick={() => navigate(routes.admin.maintenanceRecord(record.id))}>
                  {record.reference}
                </button>
                <span className="text-muted">{record.vehicleName} · {record.status} · {formatMediumDate(record.updatedAt.slice(0, 10))}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-small text-muted">No maintenance activity yet.</p>
        )}
      </section>
      <MaintenanceSearch value={search} onChange={setSearch} resultCount={result?.total ?? 0} />
      <MaintenanceFilters
        filters={filters}
        vehicles={vehicles}
        activeCount={activeCount}
        onChange={(next) => setFilters(next)}
        onReset={() => setFilters(emptyFilters)}
      />
      <Select id="maintenance-sort" label="Sort" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} options={sorts} />
      {error ? <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger">{error}</p> : null}
      {!error && result && result.records.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-small text-muted">No maintenance records match these filters.</p>
      ) : null}
      {result?.records?.length ? (
        <>
          <MaintenanceTable
            records={result.records}
            onView={(record) => navigate(routes.admin.maintenanceRecord(record.id))}
            onEdit={(record) => navigate(routes.admin.editMaintenance(record.id))}
            onStart={(record) => openDialog('start', record)}
            onComplete={(record) => openDialog('complete', record)}
            onCancel={(record) => openDialog('cancel', record)}
          />
          <MaintenanceMobileCards
            records={result.records}
            onView={(record) => navigate(routes.admin.maintenanceRecord(record.id))}
            onEdit={(record) => navigate(routes.admin.editMaintenance(record.id))}
            onStart={(record) => openDialog('start', record)}
            onComplete={(record) => openDialog('complete', record)}
            onCancel={(record) => openDialog('cancel', record)}
          />
          <div className="flex items-center justify-between">
            <p className="text-caption text-muted">Page {result.page} of {result.pageCount}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={result.page <= 1} onClick={() => load(result.page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={result.page >= result.pageCount} onClick={() => load(result.page + 1)}>Next</Button>
            </div>
          </div>
        </>
      ) : null}
      <MaintenanceConfirmDialog
        mode={dialog?.mode}
        record={dialog?.record}
        loading={saving}
        error={dialogError}
        onClose={() => setDialog(null)}
        onConfirm={confirm}
      />
    </div>
  )
}
