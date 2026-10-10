import { useAuth } from '@/hooks/useAuth'

export function CustomerWelcome() {
  const { user } = useAuth()
  const name = user?.firstName?.trim()

  return (
    <section>
      <h2 className="text-h3 text-foreground">{name ? `Welcome back, ${name} 👋` : 'Welcome back!'}</h2>
      <p className="mt-1 text-small text-muted">Here&apos;s what&apos;s happening with your rentals.</p>
    </section>
  )
}
