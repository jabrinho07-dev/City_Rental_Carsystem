import { useAuth } from '@/hooks/useAuth'
import { roleTitle } from '@/components/admin/AdminSidebar'

function greeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function AdminWelcome() {
  const { user } = useAuth()
  const name = user?.firstName?.trim() || roleTitle(user?.role)

  return (
    <section>
      <p className="text-caption font-semibold tracking-[0.14em] text-accent uppercase">{roleTitle(user?.role)}</p>
      <h2 className="text-h3 mt-1 text-foreground">
        {greeting()}, {name} 👋
      </h2>
      <p className="mt-1 text-small text-muted">Here&apos;s what&apos;s happening with your rental business today.</p>
    </section>
  )
}
