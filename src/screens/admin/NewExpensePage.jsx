import { useEffect, useState } from 'react'
import { useNavigate } from '@/lib/router'
import { ExpenseForm } from '@/components/admin/expenses/ExpenseForm'
import { routes } from '@/constants/routes'
import { createExpense, ExpenseError, listExpenseOptions } from '@/services/expenseService'
import { emptyExpenseForm } from '@/validators/expenseSchema'

const NOTICE_KEY = 'city-rental-car.expense-notice'

export default function NewExpensePage() {
  const navigate = useNavigate()
  const [options, setOptions] = useState({ vehicles: [], maintenance: [] })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setOptions(listExpenseOptions())
  }, [])

  async function onSubmit(data) {
    setFormError('')
    try {
      const saved = await createExpense(data)
      sessionStorage.setItem(NOTICE_KEY, `${saved.expenseReference} was recorded as ${saved.approvalStatus} and ${saved.paymentStatus}.`)
      navigate(routes.admin.expense(saved.id))
    } catch (error) {
      setFormError(error instanceof ExpenseError ? error.message : 'The expense could not be saved.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-h2 text-foreground">Add expense</h1>
        <p className="mt-1 text-small text-muted">A new expense starts as Pending approval. Choosing Paid does not approve it.</p>
      </div>
      {formError ? <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">{formError}</p> : null}
      <ExpenseForm
        values={emptyExpenseForm}
        vehicles={options.vehicles}
        maintenance={options.maintenance}
        submitLabel="Save expense"
        onSubmit={onSubmit}
        onCancel={() => navigate(routes.admin.expenses)}
      />
    </div>
  )
}
