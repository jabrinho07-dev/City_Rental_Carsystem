import { Button } from '@/components/ui/Button'
import { PaymentStatusBadge } from '@/components/admin/payments/PaymentStatusBadge'
import { formatMediumDate, formatMoney } from '@/utils/customerFormat'

function Actions({ payment, onView, onRecord, onRefund }) {
  const canRecord = payment.status === 'Pending' && payment.paymentType !== 'Refund'
  const canRefund = payment.refundable > 0
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onView(payment)}>
        View details
      </Button>
      {canRecord ? (
        <Button size="sm" onClick={() => onRecord(payment)}>
          Record payment
        </Button>
      ) : null}
      {canRefund ? (
        <Button size="sm" variant="secondary" onClick={() => onRefund(payment)}>
          Record refund
        </Button>
      ) : null}
    </div>
  )
}

export function PaymentTable({ payments, onView, onRecord, onRefund }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface shadow-card lg:block">
      <table className="w-full min-w-[68rem] border-collapse text-left">
        <caption className="sr-only">Payments</caption>
        <thead className="bg-canvas text-caption font-semibold tracking-wide text-muted uppercase">
          <tr>
            {['Transaction', 'Booking', 'Customer', 'Date', 'Method', 'Type', 'Amount', 'Status', 'Actions'].map((heading) => (
              <th key={heading} scope="col" className="px-3 py-3 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t border-border">
              <th scope="row" className="px-3 py-3 text-small font-semibold text-foreground">
                {payment.transactionReference}
              </th>
              <td className="px-3 py-3 text-small text-foreground">{payment.bookingReference}</td>
              <td className="px-3 py-3 text-small text-foreground">{payment.customerName}</td>
              <td className="px-3 py-3 text-small text-foreground">{formatMediumDate((payment.paidAt || payment.createdAt).slice(0, 10))}</td>
              <td className="px-3 py-3 text-small text-foreground">{payment.paymentMethod}</td>
              <td className="px-3 py-3 text-small text-foreground">{payment.paymentType}</td>
              <td className="px-3 py-3 text-small font-semibold text-foreground">{formatMoney(payment.amount)} USD</td>
              <td className="px-3 py-3">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="px-3 py-3">
                <Actions payment={payment} onView={onView} onRecord={onRecord} onRefund={onRefund} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PaymentRowActions(props) {
  return <Actions {...props} />
}
