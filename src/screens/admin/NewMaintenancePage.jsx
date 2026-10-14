import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { MaintenanceForm } from '@/components/admin/maintenance/MaintenanceForm'
import { routes } from '@/constants/routes'
import { createMaintenance, listMaintenanceVehicles, MaintenanceError } from '@/services/maintenanceService'
import { emptyMaintenanceForm } from '@/validators/maintenanceSchema'

const NOTICE_KEY = 'city-rental-car.maintenance-notice'

export default function NewMaintenancePage() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setVehicles(listMaintenanceVehicles())
  }, [])

  async function onSubmit(data) {
    setFormError('')
    try {
      const saved = await createMaintenance(data)
      sessionStorage.setItem(NOTICE_KEY, `${saved.reference} was scheduled.`)
      navigate(routes.admin.maintenanceRecord(saved.id))
    } catch (error) {
      setFormError(error instanceof MaintenanceError ? error.message : 'The maintenance record could not be saved.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-h2 text-foreground">Add maintenance record</h1>
        <p className="mt-1 text-small text-muted">The job starts as Scheduled. Costs stay estimates until the work is completed.</p>
      </div>
      {formError ? <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">{formError}</p> : null}
      <MaintenanceForm
        values={emptyMaintenanceForm}
        vehicles={vehicles}
        submitLabel="Save maintenance record"
        onSubmit={onSubmit}
        onCancel={() => navigate(routes.admin.maintenance)}
      />
    </div>
  )
}
