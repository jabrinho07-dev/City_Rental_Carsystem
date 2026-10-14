import { Select } from '@/components/ui/Select'
import { SettingsSection } from '@/components/admin/settings/SettingsSection'
import { landingPages } from '@/utils/settingsDefaults'

export function AdminPreferencesForm({ register, errors }) {
  const field = errors.admin || {}
  return (
    <SettingsSection title="Admin preferences" description="The session timeout is displayed as a preference. It does not change sign-in security without a backend.">
      <Select id="landing" label="Default dashboard landing page" options={landingPages} error={field.landingPage?.message} {...register('admin.landingPage')} />
      <Select id="page-size" label="Preferred table page size" options={[{ value: '4', label: '4' }, { value: '6', label: '6' }, { value: '10', label: '10' }]} error={field.pageSize?.message} {...register('admin.pageSize')} />
      <Select id="timeout" label="Session timeout preference (minutes)" options={[{ value: '15', label: '15' }, { value: '30', label: '30' }, { value: '60', label: '60' }, { value: '120', label: '120' }]} error={field.sessionTimeoutMinutes?.message} {...register('admin.sessionTimeoutMinutes')} />
      <label className="flex items-center gap-2 text-small text-foreground">
        <input type="checkbox" {...register('admin.showSummaryWidgets')} />
        Show dashboard summary widgets
      </label>
    </SettingsSection>
  )
}
