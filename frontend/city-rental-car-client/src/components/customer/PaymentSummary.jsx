import { Card } from '@/components/ui/Card'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'

export function PaymentSummary({ summary }) {
  const items = [
    { label: 'Total Paid', value: formatMoney(summary?.totalPaid) },
    { label: 'Outstanding', value: formatMoney(summary?.outstanding) },
    {
      label: 'Last Payment',
      value: summary?.lastPayment
        ? `${formatMoney(summary.lastPayment.amount)} · ${summary.lastPayment.method}`
        : '—',
      detail: summary?.lastPayment ? formatMediumDate(summary.lastPayment.date) : null,
    },
    { label: 'Payment Status', value: summary?.status || '—' },
  ]

  return (
    <section>
      <h2 className="text-h3 mb-3 text-foreground">Payments</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.label} className="p-4">
            <p className="text-caption text-muted">{item.label}</p>
            <p className="mt-2 text-body font-semibold break-words text-foreground">{item.value}</p>
            {item.detail ? <p className="mt-1 text-caption text-muted">{item.detail}</p> : null}
          </Card>
        ))}
      </div>
    </section>
  )
}
