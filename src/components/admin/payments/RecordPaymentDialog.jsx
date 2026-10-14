import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { chargeTypes, paymentMethods } from '@/services/paymentService'

const schema = z.object({
  bookingId: z.string().min(1, 'Choose a booking.'),
  amount: z.string().min(1, 'Amount is required.'),
  currency: z.literal('USD', { error: 'Currency must be USD.' }),
  paymentMethod: z.enum(paymentMethods, { error: 'Choose a payment method.' }),
  paymentType: z.enum(chargeTypes, { error: 'Choose a payment type.' }),
  transactionReference: z.string(),
  notes: z.string(),
})

export function RecordPaymentDialog({ open, payment, bookings, onClose, onCreate, onSettle, error, loading }) {
  const settling = payment?.status === 'Pending'
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bookingId: '',
      amount: '',
      currency: 'USD',
      paymentMethod: 'Cash',
      paymentType: 'Partial Payment',
      transactionReference: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      bookingId: payment?.bookingId || '',
      amount: payment?.status === 'Pending' ? String(payment.amount) : '',
      currency: 'USD',
      paymentMethod: payment?.paymentMethod || 'Cash',
      paymentType: payment?.paymentType && payment.paymentType !== 'Refund' ? payment.paymentType : 'Partial Payment',
      transactionReference: payment?.status === 'Pending' ? payment.transactionReference : '',
      notes: '',
    })
  }, [open, payment, form])

  async function submit(values) {
    if (settling) {
      await onSettle(payment.id, values.notes)
      return
    }
    await onCreate(values)
  }

  const openBookings = bookings.filter((booking) => booking.outstanding > 0 || booking.id === payment?.bookingId)

  return (
    <Modal open={open} title={settling ? 'Record pending payment' : 'Record a manual payment'} onClose={onClose}>
      <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(submit)}>
        <p className="text-small text-muted">
          This saves an office record. It does not confirm that EVC Plus, Zaad, a card network, or a bank received the money.
        </p>
        <Select
          id="record-booking"
          label="Related booking"
          disabled={settling}
          error={form.formState.errors.bookingId?.message}
          options={openBookings.map((booking) => ({
            value: booking.id,
            label: `${booking.bookingReference} · ${booking.customer.name} · ${booking.outstanding} USD outstanding`,
          }))}
          placeholder="Select a booking"
          {...form.register('bookingId')}
        />
        <Input id="record-amount" label="Amount" type="number" min="1" step="1" disabled={settling} error={form.formState.errors.amount?.message} {...form.register('amount')} />
        <Select
          id="record-currency"
          label="Currency"
          options={[{ value: 'USD', label: 'USD' }]}
          error={form.formState.errors.currency?.message}
          {...form.register('currency')}
        />
        <Select
          id="record-method"
          label="Payment method"
          disabled={settling}
          options={paymentMethods.map((method) => ({ value: method, label: method }))}
          error={form.formState.errors.paymentMethod?.message}
          {...form.register('paymentMethod')}
        />
        <Select
          id="record-type"
          label="Payment type"
          disabled={settling}
          options={chargeTypes.map((type) => ({ value: type, label: type }))}
          error={form.formState.errors.paymentType?.message}
          {...form.register('paymentType')}
        />
        <Input
          id="record-reference"
          label="Transaction reference"
          hint={settling ? 'The existing reference is kept.' : 'Leave blank to generate a mock reference.'}
          disabled={settling}
          {...form.register('transactionReference')}
        />
        <Textarea id="record-notes" label="Notes" {...form.register('notes')} />
        {error ? <p className="text-small text-danger">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save payment record
          </Button>
        </div>
      </form>
    </Modal>
  )
}
