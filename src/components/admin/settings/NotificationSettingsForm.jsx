import { SettingsSection } from '@/components/admin/settings/SettingsSection'

const items = [
  ['bookingCreated', 'Booking created'],
  ['bookingConfirmed', 'Booking confirmed'],
  ['bookingCancelled', 'Booking cancelled'],
  ['paymentRecorded', 'Payment recorded'],
  ['paymentFailed', 'Payment failed'],
  ['returnReminder', 'Rental return reminder'],
  ['maintenanceReminder', 'Upcoming maintenance reminder'],
  ['inApp', 'In-app notifications'],
  ['email', 'Email notification preference'],
]

export function NotificationSettingsForm({ register }) {
  return (
    <SettingsSection title="Notification preferences" description="These switches are mock preferences. This step does not send email, SMS, or push notifications.">
      {items.map(([key, label]) => (
        <label key={key} className="flex items-center gap-2 text-small text-foreground">
          <input type="checkbox" {...register(`notifications.${key}`)} />
          {label}
        </label>
      ))}
    </SettingsSection>
  )
}
