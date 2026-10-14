import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@/lib/router'
import { MaintenanceForm } from '@/components/admin/maintenance/MaintenanceForm'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { getMaintenanceById, listMaintenanceVehicles, MaintenanceError, updateMaintenance } from '@/services/maintenanceService'
import { maintenanceToForm } from '@/validators/maintenanceSchema'

export default function EditMaintenancePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState(null)
  const [missing, setMissing] = useState(false)
  const [vehicles, setVehicles] = useState([])
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let active = true
    getMaintenanceById(id).then((found) => {
      if (!active) return
      if (!found) {
        setMissing(true)
        return
      }
      setRecord(found)
      setVehicles(listMaintenanceVehicles())
    })
    return () => {
      active = false
    }
  }, [id])

  async function onSubmit(data) {
    setFormError('')
    try {
      const saved = await updateMaintenance(id, data)
      navigate(routes.admin.maintenanceRecord(saved.id))
    } catch (error) {
      setFormError(error instanceof MaintenanceError ? error.message : 'The maintenance record could not be updated.')
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
    <div className="space-y-4">
      <div>
        <h1 className="text-h2 text-foreground">Edit {record.reference}</h1>
        <p className="mt-1 text-small text-muted">Status stays {record.status}. Use the maintenance actions to start, complete, or cancel.</p>
      </div>
      {formError ? <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">{formError}</p> : null}
      <MaintenanceForm
        values={maintenanceToForm(record)}
        resetKey={record.id}
        vehicles={vehicles}
        submitLabel="Save changes"
        onSubmit={onSubmit}
        onCancel={() => navigate(routes.admin.maintenanceRecord(record.id))}
      />
    </div>
  )
}
