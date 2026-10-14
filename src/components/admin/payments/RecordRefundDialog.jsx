import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'

const schema = z.object({
  amount: z.string().min(1, 'Refund amount is required.'),
  reason: z.string().trim().min(3, 'Enter a reason.'),
  refundReference: z.string(),
  notes: z.string(),
  confirm: z.boolean().refine((value) => value, { message: 'Confirm this simulated refund before saving.' }),
})

export function RecordRefundDialog({ open, payment, onClose, onSubmit, error, loading }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { amount: '', reason: '', refundReference: '', notes: '', confirm: false },
  })

  useEffect(() => {
    if (!open) return
    form.reset({ amount: '', reason: '', refundReference: '', notes: '', confirm: false })
  }, [open, payment, form])

  return (
    <Modal open={open} title="Record a refund" onClose={onClose}>
      <form className="mt-4 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <p className="text-small text-muted">
          This keeps the original transaction and adds a separate refund entry. It does not send money back through a bank or payment gateway.
        </p>
        <p className="text-small text-foreground">
          Refundable balance: {payment?.refundable ?? 0} USD on {payment?.transactionReference}
        </p>
        <Input id="refund-amount" label="Refund amount" type="number" min="1" step="1" error={form.formState.errors.amount?.message} {...form.register('amount')} />
        <Input id="refund-reason" label="Reason" error={form.formState.errors.reason?.message} {...form.register('reason')} />
        <Input id="refund-reference" label="Refund reference" hint="Leave blank to generate a mock reference." {...form.register('refundReference')} />
        <Textarea id="refund-notes" label="Notes" {...form.register('notes')} />
        <label className="flex items-start gap-2 text-small text-foreground">
          <input type="checkbox" className="mt-1" {...form.register('confirm')} />
          I understand this is a simulated office refund and the original payment will stay on record.
        </label>
        {form.formState.errors.confirm ? <p className="text-small text-danger">{form.formState.errors.confirm.message}</p> : null}
        {error ? <p className="text-small text-danger">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={loading}>
            Save refund record
          </Button>
        </div>
      </form>
    </Modal>
  )
}
