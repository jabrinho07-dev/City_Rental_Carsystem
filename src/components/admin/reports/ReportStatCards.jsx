import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

const cards = [
  { key: 'totalBookings', label: 'Total bookings', money: false, note: 'Created in this period' },
  { key: 'confirmed', label: 'Confirmed bookings', money: false, note: 'Created in this period' },
  { key: 'completed', label: 'Completed bookings', money: false, note: 'Created in this period' },
  { key: 'cancelled', label: 'Cancelled bookings', money: false, note: 'Created in this period' },
  { key: 'grossBookingValue', label: 'Gross booking value', money: true, note: 'Booking price. Not cash received. Cancelled and rejected are excluded.' },
  { key: 'paymentsCollected', label: 'Payments collected', money: true, note: 'Paid charges only. Pending and failed are excluded.' },
  { key: 'refunds', label: 'Refunds recorded', money: true, note: 'Separate refund records' },
  { key: 'netCollected', label: 'Net payments collected', money: true, note: 'Collected payments minus refunds' },
  { key: 'approvedExpenses', label: 'Approved expenses', money: true, note: 'Approved amounts, including amounts not yet paid' },
  { key: 'paidExpenses', label: 'Paid expenses', money: true, note: 'Cash already paid on approved expenses' },
  { key: 'netCashFlow', label: 'Net cash flow', money: true, note: 'Net payments collected minus paid expenses. Not accounting profit.' },
]

export function ReportStatCards({ summary }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <article key={card.key} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <p className="text-caption font-medium text-muted">{card.label}</p>
          <p className="text-h2 mt-2 text-foreground">
            {card.money ? formatMaintenanceMoney(summary?.[card.key]) : summary?.[card.key] ?? 0}
          </p>
          <p className="mt-1 text-caption text-muted">{card.money ? 'USD. ' : ''}{card.note}</p>
        </article>
      ))}
    </div>
  )
}
