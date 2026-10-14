import { PaymentRowActions } from '@/components/admin/payments/PaymentTable'
import { PaymentStatusBadge } from '@/components/admin/payments/PaymentStatusBadge'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'

export function PaymentMobileCards({ payments, onView, onRecord, onRefund }) {
  return (
    <div className="grid gap-3 lg:hidden">
      {payments.map((payment) => (
        <article key={payment.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-small font-semibold text-foreground">{payment.transactionReference}</h3>
              <p className="text-caption text-muted">{payment.bookingReference}</p>
            </div>
            <PaymentStatusBadge status={payment.status} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-small">
            <div>
              <dt className="text-caption text-muted">Customer</dt>
              <dd>{payment.customerName}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Date</dt>
              <dd>{formatMediumDate((payment.paidAt || payment.createdAt).slice(0, 10))}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Method</dt>
              <dd>{payment.paymentMethod}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Type</dt>
              <dd>{payment.paymentType}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Amount</dt>
              <dd className="font-semibold">{formatMoney(payment.amount)} USD</dd>
            </div>
          </dl>
          <div className="mt-3">
            <PaymentRowActions payment={payment} onView={onView} onRecord={onRecord} onRefund={onRefund} />
          </div>
        </article>
      ))}
    </div>
  )
}
