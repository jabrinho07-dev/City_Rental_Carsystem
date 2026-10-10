import { Card } from '@/components/ui/Card'
import { formatPricePerDay } from '@/constants/mockVehicles'
import { formatDuration } from '@/utils/bookingPrice'

function Row({ label, value, strong = false }) {
  return (
    <div className={`flex items-baseline justify-between gap-3 ${strong ? 'text-body' : 'text-small'}`}>
      <dt className={strong ? 'font-semibold text-foreground' : 'text-muted'}>{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  )
}

export function BookingPriceSummary({ pricing }) {
  return (
    <Card>
      <h2 className="text-h3 text-foreground">Price Summary</h2>
      <p className="mt-1 text-caption text-muted">{formatDuration(pricing.days)}</p>
      <dl className="mt-4 space-y-2" aria-live="polite">
        <Row label="Vehicle Rental" value={formatPricePerDay(pricing.base)} />
        {(pricing.extraLines || []).map((line) => (
          <Row key={line.id} label={line.name} value={formatPricePerDay(line.amount)} />
        ))}
        <Row label="Extras" value={formatPricePerDay(pricing.extrasTotal)} />
        <Row label="Subtotal" value={formatPricePerDay(pricing.subtotal)} />
        <Row label="Taxes / Fees" value={formatPricePerDay(pricing.taxes)} />
        <Row label="Security Deposit" value={formatPricePerDay(pricing.deposit)} />
        <div className="border-t border-border pt-3">
          <Row label="Total" value={formatPricePerDay(pricing.total)} strong />
        </div>
      </dl>
      <p className="mt-3 text-caption text-muted">Final pricing will be confirmed before payment.</p>
    </Card>
  )
}
