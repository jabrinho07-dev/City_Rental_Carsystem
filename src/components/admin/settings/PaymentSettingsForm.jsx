import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SettingsSection } from '@/components/admin/settings/SettingsSection'
import { paymentMethodNames } from '@/utils/settingsDefaults'

export function PaymentSettingsForm({ register, errors }) {
  const field = errors.payments || {}
  return (
    <SettingsSection title="Payment settings" description="Toggles are preferences only. An enabled method is not connected to a gateway and no payment secrets are stored.">
      {paymentMethodNames.map((method) => (
        <label key={method.key} className="flex items-center gap-2 text-small text-foreground">
          <input type="checkbox" {...register(`payments.methods.${method.key}`)} />
          {method.label}
        </label>
      ))}
      {field.methods?.cash?.message ? <p className="text-small text-danger sm:col-span-2">{field.methods.cash.message}</p> : null}
      <Input id="deposit-percent" label="Default deposit percentage" type="number" min="0" max="100" error={field.depositPercent?.message} {...register('payments.depositPercent')} />
      <div className="sm:col-span-2">
        <Textarea id="payment-terms" label="Payment terms and instructions" error={field.terms?.message} {...register('payments.terms')} />
      </div>
      <div className="sm:col-span-2">
        <Textarea id="refund-policy" label="Refund policy" error={field.refundPolicy?.message} {...register('payments.refundPolicy')} />
      </div>
    </SettingsSection>
  )
}
