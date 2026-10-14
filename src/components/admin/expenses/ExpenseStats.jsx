import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

const cards = [
  { key: 'recordedAmount', label: 'Total recorded expenses', note: 'Pending and approved amounts. Rejected expenses are excluded.' },
  { key: 'monthAmount', label: 'Expenses this month', note: 'Recorded amounts dated this month. Not the same as cash paid.' },
  { key: 'pendingAmount', label: 'Pending approval', noteKey: 'pendingCount' },
  { key: 'approvedAmount', label: 'Approved expenses', note: 'Approved amounts, whether or not they have been paid.' },
  { key: 'rejectedAmount', label: 'Rejected expenses', noteKey: 'rejectedCount' },
]

export function ExpenseStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-caption font-medium text-muted">{card.label}</p>
          <p className="text-h2 mt-2 text-foreground">{formatMaintenanceMoney(stats?.[card.key])}</p>
          <p className="mt-1 text-caption text-muted">
            USD. {card.note || `${stats?.[card.noteKey] ?? 0} records, not counted as paid cash`}
          </p>
        </article>
      ))}
    </div>
  )
}
