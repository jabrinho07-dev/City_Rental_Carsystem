import { PlaceholderPage } from '@/components/common/PlaceholderPage'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

export default function VehiclesPage() {
  return (
    <PlaceholderPage
      eyebrow="Administration"
      title="Vehicles"
      description="The fleet register will list every car, its status, and its rate. Records are not loaded yet."
    >
      <Button to={routes.admin.newVehicle} variant="secondary">
        New vehicle
      </Button>
      <Button to={routes.admin.editVehicle('preview')} variant="secondary">
        Open a sample editor
      </Button>
    </PlaceholderPage>
  )
}
