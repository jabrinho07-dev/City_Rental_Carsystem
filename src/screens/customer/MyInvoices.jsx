import { useEffect, useState } from 'react'
import { Receipt } from 'lucide-react'
import { CustomerEmptyState } from '@/components/customer/CustomerEmptyState'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { routes } from '@/constants/routes'
import { getBookingById, getInvoices } from '@/services/customerService'
import { formatMediumDate, formatMoney, paymentStatusView } from '@/utils/customerFormat'

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([])
  const [preview, setPreview] = useState(null)
  const [downloadNote, setDownloadNote] = useState('')

  useEffect(() => {
    let active = true
    getInvoices().then((items) => {
      if (active) setInvoices(items)
    })
    return () => {
      active = false
    }
  }, [])

  async function openInvoice(invoice) {
    const booking = await getBookingById(invoice.bookingId)
    setPreview({ invoice, booking })
  }

  return (
    <div className="space-y-4">
      {downloadNote ? <p className="text-small text-muted">{downloadNote}</p> : null}
      {invoices.length === 0 ? (
        <CustomerEmptyState
          icon={Receipt}
          title="No invoices yet"
          message="Invoice records will appear after a rental is billed."
          actionLabel="Browse Cars"
          actionTo={routes.cars}
        />
      ) : (
        <>
          <Card className="hidden overflow-hidden p-0 lg:block">
            <table className="w-full text-left text-small">
              <thead className="bg-canvas text-caption tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Invoice Number</th>
                  <th className="px-4 py-3 font-semibold">Booking</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const status = paymentStatusView(invoice.status)
                  return (
                    <tr key={invoice.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{invoice.id}</td>
                      <td className="px-4 py-3">{invoice.bookingId}</td>
                      <td className="px-4 py-3">{formatMediumDate(invoice.date)}</td>
                      <td className="px-4 py-3">{formatMoney(invoice.amount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button type="button" className="font-semibold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" onClick={() => openInvoice(invoice)}>
                            View
                          </button>
                          <button
                            type="button"
                            className="font-semibold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                            onClick={() => setDownloadNote('Download will be available when invoice files are connected.')}
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
          <ul className="space-y-3 lg:hidden">
            {invoices.map((invoice) => {
              const status = paymentStatusView(invoice.status)
              return (
                <li key={invoice.id}>
                  <Card className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-caption font-semibold text-accent">{invoice.id}</p>
                        <p className="mt-1 font-semibold">{invoice.bookingId}</p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-small text-muted">{formatMediumDate(invoice.date)}</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{formatMoney(invoice.amount)}</p>
                      <div className="flex gap-3">
                        <button type="button" className="text-small font-semibold underline-offset-2 hover:underline" onClick={() => openInvoice(invoice)}>
                          View
                        </button>
                        <button
                          type="button"
                          className="text-small font-semibold underline-offset-2 hover:underline"
                          onClick={() => setDownloadNote('Download will be available when invoice files are connected.')}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        </>
      )}

      <Modal open={Boolean(preview)} title={preview?.invoice.id || 'Invoice'} onClose={() => setPreview(null)}>
        {preview ? (
          <div className="space-y-3 text-small">
            <p className="text-muted">Sample invoice preview. This is not a tax document.</p>
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-caption text-muted">Booking</dt>
                <dd className="font-medium">{preview.invoice.bookingId}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted">Vehicle</dt>
                <dd className="font-medium">{preview.booking?.vehicleName || '—'}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted">Date</dt>
                <dd className="font-medium">{formatMediumDate(preview.invoice.date)}</dd>
              </div>
              <div>
                <dt className="text-caption text-muted">Amount</dt>
                <dd className="font-medium">{formatMoney(preview.invoice.amount)}</dd>
              </div>
            </dl>
            <Button variant="outline" onClick={() => setPreview(null)}>
              Close
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
