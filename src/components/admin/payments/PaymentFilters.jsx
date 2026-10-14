import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { paymentMethods, paymentStatuses, paymentTypes } from '@/services/paymentService'

export function PaymentFilters({ filters, onChange, onReset, activeCount }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          id="payment-status"
          label="Payment status"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
          placeholder="All statuses"
          options={paymentStatuses.map((status) => ({ value: status, label: status }))}
        />
        <Select
          id="payment-method"
          label="Payment method"
          value={filters.method}
          onChange={(event) => onChange({ ...filters, method: event.target.value })}
          placeholder="All methods"
          options={paymentMethods.map((method) => ({ value: method, label: method }))}
        />
        <Select
          id="payment-type"
          label="Payment type"
          value={filters.type}
          onChange={(event) => onChange({ ...filters, type: event.target.value })}
          placeholder="All types"
          options={paymentTypes.map((type) => ({ value: type, label: type }))}
        />
        <div className="grid grid-cols-2 gap-2">
          <label className="text-caption font-medium text-foreground" htmlFor="payment-from">
            From
            <input
              id="payment-from"
              type="date"
              value={filters.dateFrom}
              onChange={(event) => onChange({ ...filters, dateFrom: event.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small"
            />
          </label>
          <label className="text-caption font-medium text-foreground" htmlFor="payment-to">
            To
            <input
              id="payment-to"
              type="date"
              value={filters.dateTo}
              onChange={(event) => onChange({ ...filters, dateTo: event.target.value })}
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small"
            />
          </label>
        </div>
      </div>
      {activeCount > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-caption text-muted">{activeCount} active filters</p>
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset filters
          </Button>
        </div>
      ) : null}
    </div>
  )
}
