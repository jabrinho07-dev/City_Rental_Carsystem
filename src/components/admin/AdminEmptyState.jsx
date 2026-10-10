import { Card } from '@/components/ui/Card'

export function AdminEmptyState({ icon: Icon, title, message }) {
  return (
    <Card className="text-center">
      {Icon ? <Icon className="mx-auto text-accent" size={28} aria-hidden="true" /> : null}
      <h2 className="text-h3 mt-3 text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-small text-muted">{message}</p>
    </Card>
  )
}
