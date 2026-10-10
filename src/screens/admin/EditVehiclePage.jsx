import { useParams } from '@/lib/router'
import { PlaceholderPage } from '@/components/common/PlaceholderPage'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

export default function EditVehiclePage() {
  const { id } = useParams()

  return (
    <PlaceholderPage
      eyebrow="Administration"
      title="Edit vehicle"
      description={`Reference ${id}. Vehicle details will be edited here when fleet management is connected.`}
    >
      <Button to={routes.admin.vehicles} variant="secondary">
        Back to vehicles
      </Button>
    </PlaceholderPage>
  )
}
