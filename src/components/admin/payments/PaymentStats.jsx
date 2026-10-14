import { formatMoney } from '@/utils/customerFormat'

const cards = [
  { key: 'totalRecords', label: 'Total payment records', money: false, note: 'Charges and separate refund entries' },
  { key: 'grossPaid', label: 'Total successfully paid', money: true, note: 'Gross collected. Pending and failed are excluded.' },
  { key: 'pendingAmount', label: 'Pending payments', money: true, noteKey: 'pendingCount', noteSuffix: 'pending, not counted as revenue' },
  { key: 'failedAmount', label: 'Failed payments', money: true, noteKey: 'failedCount', noteSuffix: 'failed, not counted as revenue' },
  { key: 'refundedAmount', label: 'Total refunded', money: true, note: 'From refund records only' },
  { key: 'netCollected', label: 'Net collected', money: true, note: 'Gross paid minus refund records' },
]

export function PaymentStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const value = stats?.[card.key] ?? 0
        const caption = card.note || `${stats?.[card.noteKey] ?? 0} ${card.noteSuffix}`
        return (
          <article key={card.key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
            <p className="text-caption font-medium text-muted">{card.label}</p>
            <p className="text-h2 mt-2 text-foreground">{card.money ? formatMoney(value) : value}</p>
            <p className="mt-1 text-caption text-muted">
              {card.money ? 'USD. ' : ''}
              {caption}
            </p>
          </article>
        )
      })}
    </div>
  )
}
