import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function CustomerEmptyState({ icon: Icon, title, message, actionLabel, actionTo }) {
  return (
    <Card className="text-center">
      {Icon ? <Icon className="mx-auto text-accent" size={28} aria-hidden="true" /> : null}
      <h2 className="text-h3 mt-3 text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-small text-muted">{message}</p>
      {actionTo && actionLabel ? (
        <div className="mt-5">
          <Button to={actionTo}>{actionLabel}</Button>
        </div>
      ) : null}
    </Card>
  )
}
