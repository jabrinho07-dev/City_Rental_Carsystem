import { useMemo, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { VehicleForm } from '@/components/admin/vehicles/VehicleForm'
import { routes } from '@/constants/routes'
import { createVehicle, setVehicleNotice, VehicleError } from '@/services/vehicleService'
import { emptyVehicleForm } from '@/validators/vehicleSchema'

export default function NewVehiclePage() {
  const navigate = useNavigate()
  const values = useMemo(() => emptyVehicleForm, [])
  const [formError, setFormError] = useState('')

  async function onSubmit(data) {
    setFormError('')
    try {
      await createVehicle(data)
      setVehicleNotice(`${data.brand} ${data.model} was added to the fleet.`)
      navigate(routes.admin.vehicles)
    } catch (error) {
      setFormError(error instanceof VehicleError ? error.message : 'The vehicle could not be saved.')
    }
  }

  return (
    <div className="space-y-4">
      {formError ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      <VehicleForm values={values} submitLabel="Save vehicle" onSubmit={onSubmit} onCancel={() => navigate(routes.admin.vehicles)} />
    </div>
  )
}
