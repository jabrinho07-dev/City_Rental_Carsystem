import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@/lib/router'
import { ExpenseForm } from '@/components/admin/expenses/ExpenseForm'
import { Button } from '@/components/ui/Button'
import { routes } from '@/constants/routes'
import { ExpenseError, getExpenseById, listExpenseOptions, updateExpense } from '@/services/expenseService'
import { expenseToForm } from '@/validators/expenseSchema'

export default function EditExpensePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [missing, setMissing] = useState(false)
  const [options, setOptions] = useState({ vehicles: [], maintenance: [] })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    let active = true
    getExpenseById(id).then((found) => {
      if (!active) return
      if (!found) {
        setMissing(true)
        return
      }
      setExpense(found)
      setOptions(listExpenseOptions())
    })
    return () => {
      active = false
    }
  }, [id])

  async function onSubmit(data) {
    setFormError('')
    try {
      const saved = await updateExpense(id, data)
      navigate(routes.admin.expense(saved.id))
    } catch (error) {
      setFormError(error instanceof ExpenseError ? error.message : 'The expense could not be updated.')
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

  const locked = expense.approvalStatus !== 'Pending' || expense.paymentStatus === 'Paid' || expense.paymentStatus === 'Partially Paid'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-h2 text-foreground">Edit {expense.expenseReference}</h1>
        <p className="mt-1 text-small text-muted">Approval stays {expense.approvalStatus}. Payment stays {expense.paymentStatus}.</p>
      </div>
      {formError ? <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">{formError}</p> : null}
      <ExpenseForm
        values={expenseToForm(expense)}
        resetKey={expense.id}
        vehicles={options.vehicles}
        maintenance={options.maintenance}
        locked={locked}
        submitLabel="Save changes"
        onSubmit={onSubmit}
        onCancel={() => navigate(routes.admin.expense(expense.id))}
      />
    </div>
  )
}
