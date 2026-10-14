import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { SettingsSection } from '@/components/admin/settings/SettingsSection'

export function GeneralSettingsForm({ register, errors, logoPreview, onLogo, onClearLogo }) {
  const field = errors.general || {}
  return (
    <SettingsSection title="General business settings" description="These details are stored in this browser. The logo is a local preview only.">
      <Input id="business-name" label="Business name" error={field.businessName?.message} {...register('general.businessName')} />
      <Input id="business-tagline" label="Tagline" error={field.tagline?.message} {...register('general.tagline')} />
      <Input id="contact-email" label="Contact email" error={field.contactEmail?.message} {...register('general.contactEmail')} />
      <Input id="contact-phone" label="Contact phone" error={field.contactPhone?.message} {...register('general.contactPhone')} />
      <Input id="website" label="Website URL" error={field.website?.message} {...register('general.website')} />
      <Input id="city" label="City" error={field.city?.message} {...register('general.city')} />
      <Input id="country" label="Country" error={field.country?.message} {...register('general.country')} />
      <div className="sm:col-span-2">
        <Textarea id="address" label="Business address" error={field.address?.message} {...register('general.address')} />
      </div>
      <Input id="support-email" label="Support email" error={field.supportEmail?.message} {...register('general.supportEmail')} />
      <Input id="support-phone" label="Support phone" error={field.supportPhone?.message} {...register('general.supportPhone')} />
      <div className="sm:col-span-2 space-y-2">
        <label className="text-small font-medium text-foreground" htmlFor="logo">Business logo</label>
        <input id="logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={onLogo} className="block text-small" />
        <p className="text-caption text-muted">PNG, JPG, or WebP up to 400 KB. Nothing is uploaded to a server.</p>
        {logoPreview ? (
          <div className="flex items-center gap-3">
            <img src={logoPreview} alt="Selected logo preview" className="h-16 w-16 rounded-md border border-border object-cover" />
            <button type="button" className="text-small text-danger underline" onClick={onClearLogo}>Remove preview</button>
          </div>
        ) : null}
      </div>
    </SettingsSection>
  )
}
