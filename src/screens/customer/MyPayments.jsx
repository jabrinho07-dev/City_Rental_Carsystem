import { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { PaymentSummary } from '@/components/customer/PaymentSummary'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { mockPaymentSummary } from '@/constants/mockCustomerData'
import { routes } from '@/constants/routes'
import { getPayments } from '@/services/customerService'
import { formatMediumDate, formatMoney, paymentStatusView } from '@/utils/customerFormat'

export default function MyPayments() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    let active = true
    getPayments().then((items) => {
      if (active) setPayments(items)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <PaymentSummary summary={mockPaymentSummary} />
      <section>
        <h2 className="text-h3 mb-3 text-foreground">Payment history</h2>
        {payments.length === 0 ? (
          <CustomerEmptyState
            icon={CreditCard}
            title="No payments yet"
            message="Charges for your rentals will appear here."
            actionLabel="Browse Cars"
            actionTo={routes.cars}
          />
        ) : (
          <>
            <Card className="hidden overflow-hidden p-0 lg:block">
              <table className="w-full text-left text-small">
                <thead className="bg-canvas text-caption tracking-wide text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Payment ID</th>
                    <th className="px-4 py-3 font-semibold">Booking</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Method</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const status = paymentStatusView(payment.status)
                    return (
                      <tr key={payment.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{payment.id}</td>
                        <td className="px-4 py-3">{payment.bookingId}</td>
                        <td className="px-4 py-3">{formatMediumDate(payment.date)}</td>
                        <td className="px-4 py-3">{payment.method}</td>
                        <td className="px-4 py-3">{formatMoney(payment.amount)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
            <ul className="space-y-3 lg:hidden">
              {payments.map((payment) => {
                const status = paymentStatusView(payment.status)
                return (
                  <li key={payment.id}>
                    <Card className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-caption font-semibold text-accent">{payment.id}</p>
                          <p className="mt-1 font-semibold">{payment.bookingId}</p>
                        </div>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-small text-muted">
                        {payment.method} · {formatMediumDate(payment.date)}
                      </p>
                      <p className="font-semibold">{formatMoney(payment.amount)}</p>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
