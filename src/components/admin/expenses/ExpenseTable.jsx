import { ExpenseActions } from '@/components/admin/expenses/ExpenseActions'
import { ExpenseCategoryBadge } from '@/components/admin/expenses/ExpenseCategoryBadge'
import { ExpenseApprovalBadge, ExpensePaymentBadge } from '@/components/admin/expenses/ExpenseStatusBadge'
import { formatMediumDate } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

export function ExpenseTable({ expenses, canApprove, onView, onEdit, onApprove, onReject }) {
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-border bg-surface shadow-card lg:block">
      <table className="w-full min-w-[72rem] border-collapse text-left">
        <caption className="sr-only">Expenses</caption>
        <thead className="bg-canvas text-caption font-semibold tracking-wide text-muted uppercase">
          <tr>
            {['Reference', 'Title', 'Category', 'Date', 'Amount', 'Approval', 'Payment', 'Actions'].map((heading) => (
              <th key={heading} scope="col" className="px-3 py-3 font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-t border-border">
              <th scope="row" className="px-3 py-3 text-small font-semibold text-foreground">{expense.expenseReference}</th>
              <td className="px-3 py-3 text-small text-foreground">{expense.title}</td>
              <td className="px-3 py-3"><ExpenseCategoryBadge category={expense.category} /></td>
              <td className="px-3 py-3 text-small text-foreground">{formatMediumDate(expense.expenseDate)}</td>
              <td className="px-3 py-3 text-small font-semibold text-foreground">{formatMaintenanceMoney(expense.amount)} USD</td>
              <td className="px-3 py-3"><ExpenseApprovalBadge status={expense.approvalStatus} /></td>
              <td className="px-3 py-3"><ExpensePaymentBadge status={expense.paymentStatus} /></td>
              <td className="px-3 py-3">
                <ExpenseActions expense={expense} canApprove={canApprove} onView={onView} onEdit={onEdit} onApprove={onApprove} onReject={onReject} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
