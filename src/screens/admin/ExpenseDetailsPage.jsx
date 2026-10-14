import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from '@/lib/router'
import { ExpenseActions } from '@/components/admin/expenses/ExpenseActions'
import { ExpenseApprovalDialog } from '@/components/admin/expenses/ExpenseApprovalDialog'
import { ExpenseCategoryBadge } from '@/components/admin/expenses/ExpenseCategoryBadge'
import { ExpenseApprovalBadge, ExpensePaymentBadge } from '@/components/admin/expenses/ExpenseStatusBadge'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { formatMediumDate } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'
import {
  ExpenseError,
  canApproveExpenses,
  getExpenseById,
  updateExpenseApproval,
  updateExpensePaymentStatus,
} from '@/services/expenseService'

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-border py-2 text-small">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  )
}

export default function ExpenseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const canApprove = canApproveExpenses(user?.role)
  const [expense, setExpense] = useState(null)
  const [missing, setMissing] = useState(false)
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const found = await getExpenseById(id)
    if (!found) {
      setMissing(true)
      setExpense(null)
      return
    }
    setMissing(false)
    setExpense(found)
  }

  useEffect(() => {
    const stored = sessionStorage.getItem('city-rental-car.expense-notice')
    if (stored) {
      setNotice(stored)
      sessionStorage.removeItem('city-rental-car.expense-notice')
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function confirm(values) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = await updateExpenseApproval(expense.id, dialog === 'reject' ? 'Rejected' : 'Approved', values)
      setDialog(null)
      setNotice(`${saved.expenseReference} is ${saved.approvalStatus}. Payment status remains ${saved.paymentStatus}. This approval is simulated.`)
      await load()
    } catch (error) {
      setDialogError(error instanceof ExpenseError ? error.message : 'The approval could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  async function markPaid() {
    setSaving(true)
    try {
      const saved = await updateExpensePaymentStatus(expense.id, 'Paid')
      setNotice(`${saved.expenseReference} is paid. Approval is still ${saved.approvalStatus}.`)
      await load()
    } catch (error) {
      setNotice('')
      setDialogError(error instanceof ExpenseError ? error.message : 'The payment status could not be changed.')
    } finally {
      setSaving(false)
    }
  }

  if (missing) {
    return (
      <div className="space-y-4">
        <h1 className="text-h2 text-foreground">Expense not found</h1>
        <Button to={routes.admin.expenses}>Return to expenses</Button>
      </div>
    )
  }

  if (!expense) return <p className="text-small text-muted">Loading expense…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">{expense.expenseReference}</h1>
          <p className="mt-1 text-small text-muted">{expense.title}</p>
        </div>
        <div className="flex gap-2">
          <ExpenseApprovalBadge status={expense.approvalStatus} />
          <ExpensePaymentBadge status={expense.paymentStatus} />
        </div>
      </div>
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      {dialogError && !dialog ? <p className="text-small text-danger">{dialogError}</p> : null}
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Expense</h2>
        <dl>
          <Row label="Category" value={<ExpenseCategoryBadge category={expense.category} />} />
          <Row label="Description" value={expense.description} />
          <Row label="Date" value={formatMediumDate(expense.expenseDate)} />
          <Row label="Vendor" value={expense.vendor} />
          <Row label="Amount" value={`${formatMaintenanceMoney(expense.amount)} ${expense.currency}`} />
          <Row label="Amount paid" value={formatMaintenanceMoney(expense.amountPaid)} />
          <Row label="Outstanding" value={formatMaintenanceMoney(expense.outstanding)} />
          <Row label="Payment method" value={expense.paymentMethod} />
          <Row label="Receipt reference" value={expense.receiptReference || 'Not recorded'} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Approval</h2>
        <p className="mt-1 text-caption text-muted">Simulated office decision. Approval does not mean the money has been paid.</p>
        <dl>
          <Row label="Approval status" value={expense.approvalStatus} />
          <Row label="Decided by" value={expense.approvedBy || '—'} />
          <Row label="Decision date" value={expense.approvedAt ? formatMediumDate(expense.approvedAt.slice(0, 10)) : '—'} />
          <Row label="Rejection reason" value={expense.rejectionReason || '—'} />
        </dl>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Relationships</h2>
        <dl>
          <Row label="Vehicle" value={expense.vehicleMissing ? 'Vehicle no longer in the fleet' : expense.vehicleName || 'None'} />
          <Row
            label="Maintenance"
            value={expense.maintenanceId ? (
              expense.maintenanceMissing ? 'Maintenance record no longer available' : (
                <Link to={routes.admin.maintenanceRecord(expense.maintenanceId)} className="text-accent underline">{expense.maintenanceReference}</Link>
              )
            ) : 'None'}
          />
          <Row label="Notes" value={expense.notes || '—'} />
          <Row label="Created" value={formatMediumDate(expense.createdAt.slice(0, 10))} />
          <Row label="Updated" value={formatMediumDate(expense.updatedAt.slice(0, 10))} />
        </dl>
        {expense.maintenanceId ? <p className="mt-3 text-caption text-muted">This link does not add the maintenance job’s own cost into the expense total.</p> : null}
      </section>
      <ExpenseActions
        expense={expense}
        canApprove={canApprove}
        onView={() => navigate(routes.admin.expense(expense.id))}
        onEdit={() => navigate(routes.admin.editExpense(expense.id))}
        onApprove={() => setDialog('approve')}
        onReject={() => setDialog('reject')}
      />
      {expense.approvalStatus !== 'Rejected' && expense.paymentStatus === 'Unpaid' ? (
        <Button onClick={markPaid} loading={saving}>Mark as paid</Button>
      ) : null}
      <Button variant="outline" to={routes.admin.expenses}>Return to expenses</Button>
      <ExpenseApprovalDialog mode={dialog} expense={dialog ? expense : null} loading={saving} error={dialogError} onClose={() => setDialog(null)} onConfirm={confirm} />
    </div>
  )
}
