import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Navigate } from '@/lib/router'
import { AdminPreferencesForm } from '@/components/admin/settings/AdminPreferencesForm'
import { BookingSettingsForm } from '@/components/admin/settings/BookingSettingsForm'
import { GeneralSettingsForm } from '@/components/admin/settings/GeneralSettingsForm'
import { LocalizationSettingsForm } from '@/components/admin/settings/LocalizationSettingsForm'
import { NotificationSettingsForm } from '@/components/admin/settings/NotificationSettingsForm'
import { PaymentSettingsForm } from '@/components/admin/settings/PaymentSettingsForm'
import { RentalPolicyForm } from '@/components/admin/settings/RentalPolicyForm'
import { SettingsNavigation } from '@/components/admin/settings/SettingsNavigation'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { routes } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { canEditSettings, getSettings, resetSettings, saveSettings, SettingsError } from '@/services/settingsService'
import { settingsSchema, settingsToForm } from '@/validators/settingsSchema'
import { useForm } from 'react-hook-form'

const sections = ['general', 'localization', 'rental', 'booking', 'payments', 'notifications', 'admin']

function currencyPreview(currency, locale) {
  try {
    return new Intl.NumberFormat(locale || 'en-US', { style: 'currency', currency: currency || 'USD' }).format(120)
  } catch {
    return `120 ${currency}`
  }
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const [section, setSection] = useState('general')
  const [notice, setNotice] = useState('')
  const [formError, setFormError] = useState('')
  const [savedAt, setSavedAt] = useState(() => getSettings().savedAt)
  const [confirmReset, setConfirmReset] = useState(false)
  const form = useForm({
    shouldUnregister: false,
    resolver: zodResolver(settingsSchema),
    defaultValues: settingsToForm(getSettings()),
  })
  const logo = form.watch('general.logoDataUrl')
  const currency = form.watch('localization.currency')
  const locale = form.watch('localization.locale')

  if (isLoading) return <p className="text-small text-muted">Loading settings…</p>
  if (!canEditSettings(user?.role)) return <Navigate to={routes.unauthorized} replace />

  async function onSubmit(values) {
    setFormError('')
    try {
      const saved = await saveSettings(values)
      setSavedAt(saved.savedAt)
      form.reset(settingsToForm(saved))
      setNotice('Settings saved in this browser.')
    } catch (error) {
      setFormError(error instanceof SettingsError ? error.message : 'The settings could not be saved.')
    }
  }

  function onInvalid(formErrors) {
    const failed = sections.find((key) => formErrors[key])
    if (failed) setSection(failed)
  }

  function onLogo(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 400 * 1024) {
      setFormError('Use a PNG, JPG, or WebP logo under 400 KB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => form.setValue('general.logoDataUrl', String(reader.result || ''), { shouldDirty: true })
    reader.readAsDataURL(file)
  }

  async function onReset() {
    const next = await resetSettings()
    form.reset(settingsToForm(next))
    setSavedAt(null)
    setConfirmReset(false)
    setNotice('Settings were reset to the defaults in this browser.')
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2 text-foreground">System Settings</h1>
          <p className="mt-1 max-w-2xl text-small text-muted">
            Configure business details and desk preferences. Saved values stay in this browser and do not change historical bookings or payments.
          </p>
          <p className="mt-2 text-caption text-muted">
            {savedAt ? `Last saved ${new Date(savedAt).toLocaleString()}` : 'Not saved yet. Defaults are in use.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => form.reset(settingsToForm(getSettings()))}>Cancel changes</Button>
          <Button variant="danger" onClick={() => setConfirmReset(true)}>Reset to defaults</Button>
          <Button type="submit" loading={form.formState.isSubmitting}>Save changes</Button>
        </div>
      </div>
      {notice ? <p className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-small text-success">{notice}</p> : null}
      {formError ? <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-small text-danger" role="alert">{formError}</p> : null}
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <SettingsNavigation active={section} onChange={setSection} />
        <div role="tabpanel">
          {section === 'general' ? (
            <GeneralSettingsForm register={form.register} errors={form.formState.errors} logoPreview={logo} onLogo={onLogo} onClearLogo={() => form.setValue('general.logoDataUrl', '', { shouldDirty: true })} />
          ) : null}
          {section === 'localization' ? (
            <LocalizationSettingsForm register={form.register} errors={form.formState.errors} preview={currencyPreview(currency, locale)} />
          ) : null}
          {section === 'rental' ? <RentalPolicyForm register={form.register} errors={form.formState.errors} /> : null}
          {section === 'booking' ? <BookingSettingsForm register={form.register} errors={form.formState.errors} /> : null}
          {section === 'payments' ? <PaymentSettingsForm register={form.register} errors={form.formState.errors} /> : null}
          {section === 'notifications' ? <NotificationSettingsForm register={form.register} /> : null}
          {section === 'admin' ? <AdminPreferencesForm register={form.register} errors={form.formState.errors} /> : null}
        </div>
      </div>
      <Modal open={confirmReset} title="Reset settings" onClose={() => setConfirmReset(false)}>
        <p className="mt-3 text-small text-muted">This replaces the saved preferences in this browser with the original defaults.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmReset(false)}>Back</Button>
          <Button variant="danger" onClick={onReset}>Reset to defaults</Button>
        </div>
      </Modal>
    </form>
  )
}
