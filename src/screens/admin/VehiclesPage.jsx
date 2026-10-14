import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { VehicleDeleteDialog } from '@/components/admin/vehicles/VehicleDeleteDialog'
import { VehicleFilters } from '@/components/admin/vehicles/VehicleFilters'
import { VehicleMobileCards } from '@/components/admin/vehicles/VehicleMobileCards'
import { VehicleSearch } from '@/components/admin/vehicles/VehicleSearch'
import { VehicleStats } from '@/components/admin/vehicles/VehicleStats'
import { VehicleStatusBadge } from '@/components/admin/vehicles/VehicleStatusBadge'
import { VehicleTable } from '@/components/admin/vehicles/VehicleTable'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { routes } from '@/constants/routes'
import { deleteVehicle, getVehicles, updateVehicleStatus, VehicleError } from '@/services/vehicleService'
import { vehicleStatuses } from '@/validators/vehicleSchema'

const initialFilters = { category: '', status: '', transmission: '', fuel: '', sort: 'newest' }

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)
  const [nextStatus, setNextStatus] = useState('Available')
  const [savingStatus, setSavingStatus] = useState(false)

  const activeFilters = [
    search ? `Search: ${search}` : '',
    filters.category,
    filters.status,
    filters.transmission,
    filters.fuel,
    filters.sort !== 'newest' ? 'Custom sort' : '',
  ].filter(Boolean)

  async function load(nextPage = page) {
    setLoading(true)
    setError('')
    try {
      const data = await getVehicles({ search, ...filters, page: nextPage })
      setResult(data)
      setPage(data.page)
    } catch (loadError) {
      setError(loadError instanceof VehicleError ? loadError.message : 'The vehicle list could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const message = sessionStorage.getItem('city-rental-car.vehicle-notice')
    if (!message) return undefined
    setNotice(message)
    const timer = window.setTimeout(() => sessionStorage.removeItem('city-rental-car.vehicle-notice'), 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    load(page)
    // Filters and page are the query. load closes over the latest values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters, page])

  function changeFilter(key, value) {
    setPage(1)
    setFilters((current) => ({ ...current, [key]: value }))
  }

  function resetFilters() {
    setSearch('')
    setFilters(initialFilters)
    setPage(1)
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteVehicle(pendingDelete.id)
      setNotice(`${pendingDelete.brand} ${pendingDelete.model} was deleted.`)
      setPendingDelete(null)
      await load(1)
      setPage(1)
    } catch (deleteError) {
      setNotice(deleteError instanceof VehicleError ? deleteError.message : 'The vehicle could not be deleted.')
      setPendingDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  async function confirmStatus() {
    if (!pendingStatus) return
    setSavingStatus(true)
    try {
      await updateVehicleStatus(pendingStatus.id, nextStatus)
      setNotice(`${pendingStatus.brand} ${pendingStatus.model} is now ${nextStatus}.`)
      setPendingStatus(null)
      await load(page)
    } catch (statusError) {
      setNotice(statusError instanceof VehicleError ? statusError.message : 'The status could not be changed.')
      setPendingStatus(null)
    } finally {
      setSavingStatus(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-small text-muted">
          {result ? `${result.total} matching vehicle${result.total === 1 ? '' : 's'}` : 'Fleet records'}
        </p>
        <Button to={routes.admin.newVehicle} icon={Plus}>
          Add New Vehicle
        </Button>
      </div>

      {notice ? (
        <p className="rounded-md border border-success/30 bg-success/10 px-4 py-3 text-small font-medium text-success" role="status">
          {notice}
        </p>
      ) : null}

      <VehicleStats stats={result?.stats} />

      <section className="space-y-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:p-5">
        <VehicleSearch
          value={search}
          onChange={(value) => {
            setPage(1)
            setSearch(value)
          }}
        />
        <VehicleFilters filters={filters} active={activeFilters} onChange={changeFilter} onReset={resetFilters} />
      </section>

      {loading ? <p className="text-small text-muted">Loading vehicles...</p> : null}
      {error ? (
        <div className="rounded-lg border border-danger/30 bg-surface p-5">
          <p className="text-body text-danger">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => load(page)}>
            Try again
          </Button>
        </div>
      ) : null}

      {!loading && !error && result?.vehicles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface p-8 text-center">
          <h2 className="text-h3 text-foreground">{result.stats.total === 0 ? 'No vehicles yet' : 'No vehicles match'}</h2>
          <p className="mx-auto mt-2 max-w-md text-small text-muted">
            {result.stats.total === 0
              ? 'Add the first vehicle to start the fleet register.'
              : 'Try another brand, model, or filter combination.'}
          </p>
          {result.stats.total === 0 ? (
            <Button className="mt-5" to={routes.admin.newVehicle}>
              Add New Vehicle
            </Button>
          ) : (
            <Button className="mt-5" variant="outline" onClick={resetFilters}>
              Reset filters
            </Button>
          )}
        </div>
      ) : null}

      {!loading && !error && result?.vehicles.length ? (
        <>
          <VehicleTable
            vehicles={result.vehicles}
            onView={(vehicle) => navigate(routes.admin.vehicle(vehicle.id))}
            onEdit={(vehicle) => navigate(routes.admin.editVehicle(vehicle.id))}
            onStatus={(vehicle) => {
              setNextStatus(vehicle.status)
              setPendingStatus(vehicle)
            }}
            onDelete={setPendingDelete}
          />
          <VehicleMobileCards
            vehicles={result.vehicles}
            onView={(vehicle) => navigate(routes.admin.vehicle(vehicle.id))}
            onEdit={(vehicle) => navigate(routes.admin.editVehicle(vehicle.id))}
            onStatus={(vehicle) => {
              setNextStatus(vehicle.status)
              setPendingStatus(vehicle)
            }}
            onDelete={setPendingDelete}
          />
          <nav className="flex items-center justify-between gap-3" aria-label="Vehicle pages">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </Button>
            <p className="text-small text-muted">
              Page {page} of {result.pageCount}
            </p>
            <Button variant="outline" size="sm" disabled={page >= result.pageCount} onClick={() => setPage((current) => current + 1)}>
              Next
            </Button>
          </nav>
        </>
      ) : null}

      <VehicleDeleteDialog vehicle={pendingDelete} loading={deleting} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />

      <Modal open={Boolean(pendingStatus)} title="Change status" onClose={() => setPendingStatus(null)}>
        {pendingStatus ? (
          <div className="mt-4 space-y-4">
            <p className="text-small text-muted">
              {pendingStatus.brand} {pendingStatus.model} is currently <VehicleStatusBadge status={pendingStatus.status} />. Choose the new status and confirm. It will not change until you save.
            </p>
            <Select
              id="next-status"
              label="New status"
              value={nextStatus}
              onChange={(event) => setNextStatus(event.target.value)}
              options={vehicleStatuses.map((value) => ({ value, label: value }))}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setPendingStatus(null)} disabled={savingStatus}>
                Cancel
              </Button>
              <Button onClick={confirmStatus} loading={savingStatus}>
                Save status
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
