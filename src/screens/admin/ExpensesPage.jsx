import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { ExpenseApprovalDialog } from '@/components/admin/expenses/ExpenseApprovalDialog'
import { ExpenseCategoryChart } from '@/components/admin/expenses/ExpenseCategoryChart'
import { ExpenseFilters } from '@/components/admin/expenses/ExpenseFilters'
import { ExpenseMobileCards } from '@/components/admin/expenses/ExpenseMobileCards'
import { ExpenseSearch } from '@/components/admin/expenses/ExpenseSearch'
import { ExpenseSort } from '@/components/admin/expenses/ExpenseSort'
import { ExpenseStats } from '@/components/admin/expenses/ExpenseStats'
import { ExpenseTable } from '@/components/admin/expenses/ExpenseTable'
import { MonthlyExpenseChart } from '@/components/admin/expenses/MonthlyExpenseChart'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { formatMediumDate } from '@/utils/customerFormat'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'
import {
  ExpenseError,
  canApproveExpenses,
  getExpenses,
  listExpenseOptions,
  updateExpenseApproval,
} from '@/services/expenseService'

const emptyFilters = { category: '', approvalStatus: '', paymentStatus: '', paymentMethod: '', vehicleId: '', dateFrom: '', dateTo: '', sort: 'newest' }
const NOTICE_KEY = 'city-rental-car.expense-notice'

export default function ExpensesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const canApprove = canApproveExpenses(user?.role)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [dialogError, setDialogError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load(nextPage = page) {
    setError('')
    try {
      const data = await getExpenses({ search, ...filters, page: nextPage })
      setResult(data)
      setPage(data.page)
      setVehicles(listExpenseOptions().vehicles)
    } catch (loadError) {
      setError(loadError.message || 'Expenses could not be loaded.')
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem(NOTICE_KEY)
    if (stored) {
      setNotice(stored)
      sessionStorage.removeItem(NOTICE_KEY)
    }
    load(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters])

  const activeCount = [filters.category, filters.approvalStatus, filters.paymentStatus, filters.paymentMethod, filters.vehicleId, filters.dateFrom, filters.dateTo].filter(Boolean).length

  async function confirm(values) {
    setSaving(true)
    setDialogError('')
    try {
      const saved = await updateExpenseApproval(dialog.expense.id, dialog.mode === 'reject' ? 'Rejected' : 'Approved', values)
      setDialog(null)
      setNotice(`${saved.expenseReference} is ${saved.approvalStatus}. Payment status is still ${saved.paymentStatus}. This approval is simulated.`)
      await load(page)
    } catch (saveError) {
      setDialogError(saveError instanceof ExpenseError ? saveError.message : 'The approval could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const actions = {
    onView: (expense) => navigate(routes.admin.expense(expense.id)),
    onEdit: (expense) => navigate(routes.admin.editExpense(expense.id)),
    onApprove: (expense) => {
      setDialogError('')
      setDialog({ mode: 'approve', expense })
    },
    onReject: (expense) => {
      setDialogError('')
      setDialog({ mode: 'reject', expense })
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">Expenses Management</h1>
          <p className="mt-1 max-w-2xl text-small text-muted">
            Record operating costs, approve them separately from payment, and keep rejected items out of the approved total.
          </p>
        </div>
        <Button onClick={() => navigate(routes.admin.newExpense)}>Add expense</Button>
      </div>
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      <ExpenseStats stats={result?.stats} />
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <h2 className="text-h3 text-foreground">Recorded by category</h2>
          <p className="mt-1 text-caption text-muted">USD. Rejected expenses are excluded. Maintenance job totals are not added again.</p>
          <div className="mt-4"><ExpenseCategoryChart categories={result?.analytics?.categories} /></div>
        </article>
        <article className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <h2 className="text-h3 text-foreground">Monthly recorded expenses</h2>
          <p className="mt-1 text-caption text-muted">
            Paid cash {formatMaintenanceMoney(result?.analytics?.paidAmount)} · still unpaid {formatMaintenanceMoney(result?.analytics?.unpaidAmount)} · pending approval {formatMaintenanceMoney(result?.analytics?.pendingAmount)}
          </p>
          <div className="mt-4"><MonthlyExpenseChart months={result?.analytics?.months} /></div>
        </article>
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Category summary</h2>
        {result?.analytics?.categories?.length ? (
          <ul className="mt-3 divide-y divide-border">
            {result.analytics.categories.map((item) => (
              <li key={item.category} className="flex justify-between py-2 text-small">
                <span>{item.category}</span>
                <span className="font-semibold">{formatMaintenanceMoney(item.amount)} USD</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-small text-muted">No recorded categories yet.</p>}
      </section>
      <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
        <h2 className="text-h3 text-foreground">Recent expenses</h2>
        {result?.recent?.length ? (
          <ul className="mt-3 divide-y divide-border">
            {result.recent.map((expense) => (
              <li key={expense.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-small">
                <button type="button" className="font-semibold underline" onClick={() => navigate(routes.admin.expense(expense.id))}>{expense.expenseReference}</button>
                <span className="text-muted">{expense.title} · {formatMediumDate(expense.expenseDate)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-3 text-small text-muted">No expenses yet.</p>}
      </section>
      <ExpenseSearch value={search} onChange={setSearch} resultCount={result?.total ?? 0} />
      <ExpenseFilters filters={filters} vehicles={vehicles} activeCount={activeCount} onChange={setFilters} onReset={() => setFilters(emptyFilters)} />
      <ExpenseSort value={filters.sort} onChange={(sort) => setFilters((current) => ({ ...current, sort }))} />
      {error ? <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger">{error}</p> : null}
      {!error && result && result.expenses.length === 0 ? (
        <p className="rounded-lg border border-border bg-surface px-4 py-8 text-center text-small text-muted">No expenses match these filters.</p>
      ) : null}
      {result?.expenses?.length ? (
        <>
          <ExpenseTable expenses={result.expenses} canApprove={canApprove} {...actions} />
          <ExpenseMobileCards expenses={result.expenses} canApprove={canApprove} {...actions} />
          <div className="flex items-center justify-between">
            <p className="text-caption text-muted">Page {result.page} of {result.pageCount}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={result.page <= 1} onClick={() => load(result.page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={result.page >= result.pageCount} onClick={() => load(result.page + 1)}>Next</Button>
            </div>
          </div>
        </>
      ) : null}
      <ExpenseApprovalDialog mode={dialog?.mode} expense={dialog?.expense} loading={saving} error={dialogError} onClose={() => setDialog(null)} onConfirm={confirm} />
    </div>
  )
}
