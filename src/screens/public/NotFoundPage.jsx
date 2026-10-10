import { PublicPage } from '@/components/common/PlaceholderPage'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'

export default function NotFoundPage() {
  return (
    <PublicPage>
      <PageHeader
        eyebrow="404"
        title="This page is not on the map"
        description="The address does not match a City Rental Car screen."
      />
      <div className="mt-6">
        <Button to={routes.home}>Back to the home page</Button>
      </div>
    </PublicPage>
  )
}
