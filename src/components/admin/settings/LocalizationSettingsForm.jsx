import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SettingsSection } from '@/components/admin/settings/SettingsSection'
import { settingsCurrencies, settingsDateFormats, settingsLocales, settingsTimeZones } from '@/utils/settingsDefaults'

export function LocalizationSettingsForm({ register, errors, preview }) {
  const field = errors.localization || {}
  return (
    <SettingsSection title="Localization" description="Changing the default currency does not convert existing bookings, payments, or expenses.">
      <Select id="currency" label="Currency" options={settingsCurrencies.map((item) => ({ value: item, label: item }))} error={field.currency?.message} {...register('localization.currency')} />
      <Select id="locale" label="Locale" options={settingsLocales} error={field.locale?.message} {...register('localization.locale')} />
      <Select id="timezone" label="Time zone" options={settingsTimeZones.map((item) => ({ value: item, label: item }))} error={field.timeZone?.message} {...register('localization.timeZone')} />
      <Select id="date-format" label="Date format" options={settingsDateFormats.map((item) => ({ value: item, label: item }))} error={field.dateFormat?.message} {...register('localization.dateFormat')} />
      <Select id="time-format" label="Time format" options={[{ value: '12-hour', label: '12-hour' }, { value: '24-hour', label: '24-hour' }]} error={field.timeFormat?.message} {...register('localization.timeFormat')} />
      <p className="text-small text-foreground">Preview: {preview}</p>
    </SettingsSection>
  )
}
