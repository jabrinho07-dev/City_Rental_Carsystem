import { useEffect, useState } from 'react'
import { BookingAnalytics } from '@/components/admin/reports/BookingAnalytics'
import { CustomerAnalytics } from '@/components/admin/reports/CustomerAnalytics'
import { ExpenseAnalytics } from '@/components/admin/reports/ExpenseAnalytics'
import { FleetPerformance } from '@/components/admin/reports/FleetPerformance'
import { PaymentAnalytics } from '@/components/admin/reports/PaymentAnalytics'
import { ReportFilters } from '@/components/admin/reports/ReportFilters'
import { ReportStatCards } from '@/components/admin/reports/ReportStatCards'
import { RevenueTrendChart } from '@/components/admin/reports/RevenueTrendChart'
import { Button } from '@/components/ui/Button'
import { getReport } from '@/services/reportService'
import { downloadCsv, toCsv } from '@/utils/exportCsv'
import { formatMaintenanceMoney } from '@/utils/maintenanceCalculations'

function Panel({ title, children }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <h2 className="text-h3 text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function ReportsPage() {
  const [preset, setPreset] = useState('year')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    setError('')
    getReport({ preset, from, to }).then((result) => {
      if (!active) return
      if (result.error) {
        setError(result.error)
        return
      }
      setReport(result)
    }).catch(() => {
      if (active) setError('The report could not be loaded.')
    })
    return () => {
      active = false
    }
  }, [preset, from, to])

  function exportTable(name, rows, columns) {
    if (!report) return
    const csv = toCsv(rows, columns)
    const filename = `city-rental-${name}-${report.range.from}-to-${report.range.to}.csv`
    downloadCsv(filename, csv)
    setNotice(rows.length ? `${filename} downloaded.` : `${filename} downloaded with headings only. This period has no rows.`)
  }

  const summary = report?.summary

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 text-foreground">Reports & Analytics</h1>
        <p className="mt-1 max-w-2xl text-small text-muted">
          Figures come from the booking, payment, expense, maintenance, and vehicle records already in this browser. Booking value is not treated as cash received.
        </p>
      </div>
      <ReportFilters
        preset={preset}
        from={from}
        to={to}
        periodLabel={report?.range?.label || 'the selected period'}
        error={error}
        onPreset={setPreset}
        onFrom={setFrom}
        onTo={setTo}
      />
      {notice ? <p className="text-small text-success">{notice}</p> : null}
      {report?.otherCurrencyCount ? (
        <p className="text-small text-foreground">{report.otherCurrencyCount} payment records use another currency and are excluded from the USD totals.</p>
      ) : null}
      {!report && !error ? <p className="text-small text-muted">Loading report…</p> : null}
      {report && !error ? (
        <>
          <ReportStatCards summary={summary} />
          <Panel title="Revenue collected">
            <RevenueTrendChart points={report.trend} mode={report.trendMode} />
          </Panel>
          <div className="grid gap-4 xl:grid-cols-2">
            <Panel title="Booking analytics"><BookingAnalytics bookings={report.bookings} /></Panel>
            <Panel title="Expense analytics"><ExpenseAnalytics expenses={report.expenses} /></Panel>
            <Panel title="Fleet performance"><FleetPerformance fleet={report.fleet} /></Panel>
            <Panel title="Payment analytics"><PaymentAnalytics payments={report.payments} /></Panel>
          </div>
          <Panel title="Customers">
            <CustomerAnalytics customers={report.customers} />
          </Panel>
          <Panel title="Highlights">
            <ul className="space-y-2 text-small text-foreground">
              <li>Net payments collected are {formatMaintenanceMoney(summary.netCollected)} USD after refunds.</li>
              <li>Paid expenses are {formatMaintenanceMoney(summary.paidExpenses)} USD, so net cash flow is {formatMaintenanceMoney(summary.netCashFlow)} USD.</li>
              <li>{report.expenses.pendingCount} expenses in this period are still waiting for approval.</li>
              <li>{report.fleet.maintenance} vehicles are currently under maintenance, regardless of this date range.</li>
            </ul>
          </Panel>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => exportTable('summary', [summary], [
              { key: 'totalBookings', label: 'Total bookings' },
              { key: 'grossBookingValue', label: 'Gross booking value USD' },
              { key: 'paymentsCollected', label: 'Payments collected USD' },
              { key: 'refunds', label: 'Refunds USD' },
              { key: 'netCollected', label: 'Net payments collected USD' },
              { key: 'approvedExpenses', label: 'Approved expenses USD' },
              { key: 'paidExpenses', label: 'Paid expenses USD' },
              { key: 'netCashFlow', label: 'Net cash flow USD' },
            ])}>Export summary</Button>
            <Button variant="outline" onClick={() => exportTable('bookings', report.bookings.rows, [
              { key: 'reference', label: 'Reference' },
              { key: 'created', label: 'Created' },
              { key: 'pickup', label: 'Pickup' },
              { key: 'customer', label: 'Customer' },
              { key: 'vehicle', label: 'Vehicle' },
              { key: 'status', label: 'Status' },
              { key: 'total', label: 'Booking value USD' },
            ])}>Export bookings</Button>
            <Button variant="outline" onClick={() => exportTable('payments', report.payments.rows, [
              { key: 'reference', label: 'Reference' },
              { key: 'date', label: 'Date' },
              { key: 'method', label: 'Method' },
              { key: 'type', label: 'Type' },
              { key: 'status', label: 'Status' },
              { key: 'amount', label: 'Amount USD' },
              { key: 'manual', label: 'Record type' },
            ])}>Export payments</Button>
            <Button variant="outline" onClick={() => exportTable('expenses', report.expenses.rows, [
              { key: 'reference', label: 'Reference' },
              { key: 'date', label: 'Date' },
              { key: 'title', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'approval', label: 'Approval' },
              { key: 'payment', label: 'Payment' },
              { key: 'amount', label: 'Amount USD' },
              { key: 'paid', label: 'Paid USD' },
            ])}>Export expenses</Button>
          </div>
        </>
      ) : null}
    </div>
  )
}
