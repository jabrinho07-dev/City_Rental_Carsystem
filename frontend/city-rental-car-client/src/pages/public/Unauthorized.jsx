import { ShieldOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { dashboardPath } from '@/utils/authRedirect'

export default function Unauthorized() {
  const { user } = useAuth()

  return (
    <Card className="mx-auto max-w-xl text-center">
      <ShieldOff className="mx-auto text-danger" size={28} aria-hidden="true" />
      <p className="mt-4 text-caption font-semibold tracking-[0.14em] text-muted uppercase">403</p>
      <h1 className="text-h2 mt-2 text-foreground">Access Denied</h1>
      <p className="mt-3 text-body text-muted">You don't have permission to access this page.</p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        {user ? <Button to={dashboardPath(user.role)}>Go to Dashboard</Button> : null}
        <Button to={routes.home} variant="outline">
          Go Home
        </Button>
      </div>
    </Card>
  )
}
