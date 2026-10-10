import { PlaceholderPage } from '@/components/common/PlaceholderPage'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

export default function NewVehiclePage() {
  return (
    <PlaceholderPage
      eyebrow="Administration"
      title="New vehicle"
      description="The create form for a fleet record will live here. Nothing is saved from this screen."
    >
      <Button to={routes.admin.vehicles} variant="secondary">
        Back to vehicles
      </Button>
    </PlaceholderPage>
  )
}
