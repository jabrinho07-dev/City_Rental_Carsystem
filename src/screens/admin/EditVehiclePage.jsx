import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@/lib/router'
import { VehicleForm } from '@/components/admin/vehicles/VehicleForm'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { getVehicleById, setVehicleNotice, updateVehicle, VehicleError } from '@/services/vehicleService'
import { vehicleToForm } from '@/validators/vehicleSchema'

export default function EditVehiclePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [missing, setMissing] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let active = true
    getVehicleById(id)
      .then((vehicle) => {
        if (active) setValues(vehicleToForm(vehicle))
      })
      .catch(() => {
        if (active) setMissing(true)
      })
    return () => {
      active = false
    }
  }, [id])

  async function onSubmit(data) {
    setFormError('')
    try {
      await updateVehicle(id, data)
      setVehicleNotice(`${data.brand} ${data.model} was updated.`)
      navigate(routes.admin.vehicles)
    } catch (error) {
      setFormError(error instanceof VehicleError ? error.message : 'The vehicle could not be updated.')
    }
  }

  if (missing) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
        <h2 className="text-h3 text-foreground">Vehicle not found</h2>
        <p className="mt-2 text-small text-muted">No fleet record matches this link.</p>
        <Button className="mt-5" to={routes.admin.vehicles}>
          Back to vehicles
        </Button>
      </div>
    )
  }

  if (!values) return <p className="text-small text-muted">Loading vehicle...</p>

  return (
    <div className="space-y-4">
      {formError ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      <VehicleForm values={values} submitLabel="Save changes" onSubmit={onSubmit} onCancel={() => navigate(routes.admin.vehicles)} />
    </div>
  )
}
