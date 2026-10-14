import { Select } from '@/components/ui/Select'

const presets = [
  { value: 'today', label: 'Today' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: 'month', label: 'This month' },
  { value: 'last-month', label: 'Last month' },
  { value: 'year', label: 'This year' },
  { value: 'custom', label: 'Custom date range' },
]

export function ReportFilters({ preset, from, to, periodLabel, error, onPreset, onFrom, onTo }) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="grid gap-3 md:grid-cols-3">
        <Select id="report-period" label="Reporting period" value={preset} onChange={(event) => onPreset(event.target.value)} options={presets} />
        <label className="text-caption font-medium text-foreground" htmlFor="report-from">
          Start date
          <input id="report-from" type="date" value={from} disabled={preset !== 'custom'} onChange={(event) => onFrom(event.target.value)} className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small disabled:bg-canvas" />
        </label>
        <label className="text-caption font-medium text-foreground" htmlFor="report-to">
          End date
          <input id="report-to" type="date" value={to} disabled={preset !== 'custom'} onChange={(event) => onTo(event.target.value)} className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-small disabled:bg-canvas" />
        </label>
      </div>
      {error ? <p className="text-small text-danger" role="alert">{error}</p> : <p className="text-caption text-muted">Showing {periodLabel}. Dates use the local calendar day.</p>}
    </div>
  )
}
