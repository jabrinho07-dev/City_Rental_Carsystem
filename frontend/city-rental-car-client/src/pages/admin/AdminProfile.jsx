import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'
import { roleTitle } from '@/components/admin/AdminSidebar'

export default function AdminProfile() {
  const { user } = useAuth()

  return (
    <Card className="max-w-xl">
      <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">{roleTitle(user?.role)}</p>
      <h2 className="text-h3 mt-2 text-foreground">
        {user?.firstName} {user?.lastName}
      </h2>
      <dl className="mt-4 space-y-3 text-small">
        <div>
          <dt className="text-muted">Email</dt>
          <dd className="font-medium break-words">{user?.email}</dd>
        </div>
        <div>
          <dt className="text-muted">Phone</dt>
          <dd className="font-medium">{user?.phone || '—'}</dd>
        </div>
      </dl>
      <p className="mt-4 text-small text-muted">Account editing will be available when the admin API is connected.</p>
    </Card>
  )
}
