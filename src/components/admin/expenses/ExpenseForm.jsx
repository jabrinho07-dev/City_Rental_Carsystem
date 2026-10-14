import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  expenseCategories,
  expensePaymentMethods,
  expenseSchema,
} from '@/validators/expenseSchema'

function Section({ title, children }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 shadow-card">
      <h2 className="text-h3 text-foreground">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function ExpenseForm({ values, vehicles, maintenance, locked = false, resetKey = 'new', submitLabel, onSubmit, onCancel }) {
  const form = useForm({ resolver: zodResolver(expenseSchema), defaultValues: values })
  const paymentStatus = form.watch('paymentStatus')
  const maintenanceId = form.watch('maintenanceId')
  const selectedJob = maintenance.find((record) => record.id === maintenanceId)

  useEffect(() => {
    form.reset(values)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {locked ? (
        <p className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-small text-foreground">
          Amount, category, date, relationships, and payment status stay as recorded after approval or payment. You can still update the description, vendor, receipt reference, and notes.
        </p>
      ) : null}
      <Section title="Basic information">
        <Input id="expense-title" label="Title" error={form.formState.errors.title?.message} {...form.register('title')} />
        <Select id="expense-category" label="Category" disabled={locked} options={expenseCategories.map((item) => ({ value: item, label: item }))} error={form.formState.errors.category?.message} {...form.register('category')} />
        <div className="sm:col-span-2">
          <Textarea id="expense-description" label="Description" error={form.formState.errors.description?.message} {...form.register('description')} />
        </div>
        <Input id="expense-date" label="Expense date" type="date" disabled={locked} error={form.formState.errors.expenseDate?.message} {...form.register('expenseDate')} />
        <Input id="expense-vendor" label="Vendor" error={form.formState.errors.vendor?.message} {...form.register('vendor')} />
      </Section>
      <Section title="Financial information">
        <Input id="expense-amount" label="Amount (USD)" type="number" min="0.01" step="0.01" disabled={locked} error={form.formState.errors.amount?.message} {...form.register('amount')} />
        <Select id="expense-currency" label="Currency" disabled={locked} options={[{ value: 'USD', label: 'USD' }]} error={form.formState.errors.currency?.message} {...form.register('currency')} />
        <Select id="expense-method" label="Payment method" disabled={locked} options={expensePaymentMethods.map((item) => ({ value: item, label: item }))} error={form.formState.errors.paymentMethod?.message} {...form.register('paymentMethod')} />
        <Select id="expense-payment-status" label="Payment status" disabled={locked} options={['Unpaid', 'Paid', 'Partially Paid'].map((item) => ({ value: item, label: item }))} error={form.formState.errors.paymentStatus?.message} {...form.register('paymentStatus')} />
        {paymentStatus === 'Partially Paid' ? (
          <Input id="expense-amount-paid" label="Amount paid (USD)" type="number" min="0.01" step="0.01" disabled={locked} error={form.formState.errors.amountPaid?.message} {...form.register('amountPaid')} />
        ) : null}
        <Input id="expense-receipt" label="Receipt reference" hint="A reference only. The file is not uploaded or stored." error={form.formState.errors.receiptReference?.message} {...form.register('receiptReference')} />
      </Section>
      <Section title="Optional relationships">
        <Select id="expense-vehicle" label="Related vehicle" disabled={locked} placeholder="No vehicle" options={vehicles.map((vehicle) => ({ value: vehicle.id, label: `${vehicle.brand} ${vehicle.model}` }))} {...form.register('vehicleId')} />
        <Select id="expense-maintenance" label="Related maintenance" disabled={locked} placeholder="No maintenance record" options={maintenance.map((record) => ({ value: record.id, label: `${record.reference} · ${record.vehicleId}` }))} {...form.register('maintenanceId')} />
        {selectedJob ? (
          <p className="text-small text-muted sm:col-span-2">
            {selectedJob.reference} is linked for reference. Its maintenance cost is not added on top of this expense.
          </p>
        ) : null}
      </Section>
      <Section title="Additional information">
        <div className="sm:col-span-2">
          <Textarea id="expense-notes" label="Notes" error={form.formState.errors.notes?.message} {...form.register('notes')} />
        </div>
      </Section>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={form.formState.isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  )
}
