import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

const cards = [
  { key: 'total', label: 'Total maintenance records', money: false, note: 'Each record is counted once' },
  { key: 'scheduled', label: 'Scheduled', money: false, note: 'Not started' },
  { key: 'inProgress', label: 'In progress', money: false, note: 'Work has started' },
  { key: 'completed', label: 'Completed', money: false, note: 'Closed jobs' },
  { key: 'overdue', label: 'Overdue', money: false, note: 'Scheduled or in progress past the service date' },
  { key: 'recordedCost', label: 'Total recorded maintenance cost', money: true, note: 'Completed jobs only. Estimates are excluded.' },
]

export function MaintenanceStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-caption font-medium text-muted">{card.label}</p>
          <p className="text-h2 mt-2 text-foreground">
            {card.money ? formatMaintenanceMoney(stats?.[card.key]) : stats?.[card.key] ?? 0}
          </p>
          <p className="mt-1 text-caption text-muted">{card.money ? 'USD. ' : ''}{card.note}</p>
        </article>
      ))}
    </div>
  )
}
