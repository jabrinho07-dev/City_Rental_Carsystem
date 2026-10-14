import { ExpenseActions } from '@/components/admin/expenses/ExpenseActions'
import { ExpenseApprovalBadge, ExpensePaymentBadge } from '@/components/admin/expenses/ExpenseStatusBadge'
import { formatMediumDate } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function ExpenseMobileCards({ expenses, canApprove, onView, onEdit, onApprove, onReject }) {
  return (
    <div className="grid gap-3 lg:hidden">
      {expenses.map((expense) => (
        <article key={expense.id} className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-small font-semibold text-foreground">{expense.expenseReference}</h3>
              <p className="text-caption text-muted">{expense.title}</p>
            </div>
            <ExpenseApprovalBadge status={expense.approvalStatus} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-small">
            <div>
              <dt className="text-caption text-muted">Category</dt>
              <dd>{expense.category}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Date</dt>
              <dd>{formatMediumDate(expense.expenseDate)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Amount</dt>
              <dd className="font-semibold">{formatMaintenanceMoney(expense.amount)}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted">Payment</dt>
              <dd><ExpensePaymentBadge status={expense.paymentStatus} /></dd>
            </div>
          </dl>
          <div className="mt-3">
            <ExpenseActions expense={expense} canApprove={canApprove} onView={onView} onEdit={onEdit} onApprove={onApprove} onReject={onReject} />
          </div>
        </article>
      ))}
    </div>
  )
}
