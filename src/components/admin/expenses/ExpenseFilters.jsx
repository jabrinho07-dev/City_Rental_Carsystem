import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { expenseApprovalStatuses, expenseCategories, expensePaymentMethods, expensePaymentStatuses } from '@/validators/expenseSchema'

export function ExpenseFilters({ filters, vehicles, onChange, onReset, activeCount }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Select id="expense-category" label="Category" value={filters.category} onChange={(event) => onChange({ ...filters, category: event.target.value })} placeholder="All categories" options={expenseCategories.map((item) => ({ value: item, label: item }))} />
        <Select id="expense-approval" label="Approval status" value={filters.approvalStatus} onChange={(event) => onChange({ ...filters, approvalStatus: event.target.value })} placeholder="All approval statuses" options={expenseApprovalStatuses.map((item) => ({ value: item, label: item }))} />
        <Select id="expense-payment" label="Payment status" value={filters.paymentStatus} onChange={(event) => onChange({ ...filters, paymentStatus: event.target.value })} placeholder="All payment statuses" options={expensePaymentStatuses.map((item) => ({ value: item, label: item }))} />
        <Select id="expense-method" label="Payment method" value={filters.paymentMethod} onChange={(event) => onChange({ ...filters, paymentMethod: event.target.value })} placeholder="All methods" options={expensePaymentMethods.map((item) => ({ value: item, label: item }))} />
        <Select id="expense-vehicle" label="Vehicle" value={filters.vehicleId} onChange={(event) => onChange({ ...filters, vehicleId: event.target.value })} placeholder="All vehicles" options={vehicles.map((vehicle) => ({ value: vehicle.id, label: `${vehicle.brand} ${vehicle.model}` }))} />
        <div className="grid grid-cols-2 gap-2">
          <label className="text-caption font-medium text-foreground" htmlFor="expense-from">
            From
            <input id="expense-from" type="date" value={filters.dateFrom} onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small" />
          </label>
          <label className="text-caption font-medium text-foreground" htmlFor="expense-to">
            To
            <input id="expense-to" type="date" value={filters.dateTo} onChange={(event) => onChange({ ...filters, dateTo: event.target.value })} className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small" />
          </label>
        </div>
      </div>
      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-caption text-muted">{activeCount} active filters</p>
          <Button variant="outline" size="sm" onClick={onReset}>Reset filters</Button>
        </div>
      ) : null}
    </div>
  )
}
