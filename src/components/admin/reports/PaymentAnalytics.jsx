import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function PaymentAnalytics({ payments }) {
  return (
    <div className="space-y-4">
      <p className="text-caption text-muted">
        Collected amounts exclude pending and failed payments. Refunds are separate records. A manual payment is an office record, not proof a provider verified it. Outstanding is the current balance on bookings created in this period.
      </p>
      <p className="text-small text-foreground">
        Refunds {formatMaintenanceMoney(payments?.refunds)} USD · Outstanding {formatMaintenanceMoney(payments?.outstanding)} USD
      </p>
      <div>
        <h3 className="text-small font-semibold text-foreground">Collected by method</h3>
        {payments?.methods?.length ? (
          <ul className="mt-2 divide-y divide-border">
            {payments.methods.map((item) => (
              <li key={item.method} className="flex justify-between py-2 text-small">
                <span>{item.method}</span>
                <span>{formatMaintenanceMoney(item.amount)} USD</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-small text-muted">No collected payments in this period.</p>}
      </div>
      <div>
        <h3 className="text-small font-semibold text-foreground">Payment records by status</h3>
        <ul className="mt-2 divide-y divide-border">
          {(payments?.statuses || []).filter((item) => item.count).map((item) => (
            <li key={item.status} className="flex justify-between py-2 text-small">
              <span>{item.status}</span>
              <span>{item.count}</span>
            </li>
          ))}
        </ul>
        {(payments?.statuses || []).every((item) => !item.count) ? <p className="text-small text-muted">No payment records in this period.</p> : null}
      </div>
    </div>
  )
}
