import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { assetSrc } from '@/lib/assetSrc'
import { updateProfile } from '@/services/customerService'

function initials(profile) {
  const letters = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
  return letters || 'CR'
}

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'Somalia',
    photo: '',
    preferences: {
      email: true,
      sms: false,
      marketing: false,
    },
  })
  const [passwordNote, setPasswordNote] = useState('')
  const [savedNote, setSavedNote] = useState('')
  const [passwords, setPasswords] = useState({ next: '', confirm: '' })

  function updateField(field) {
    return (event) => {
      setSavedNote('')
      setProfile((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  function updatePreference(field) {
    return (event) => {
      setSavedNote('')
      setProfile((current) => ({
        ...current,
        preferences: { ...current.preferences, [field]: event.target.checked },
      }))
    }
  }

  function onPhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setProfile((current) => ({ ...current, photo: URL.createObjectURL(file) }))
  }

  async function onSave(event) {
    event.preventDefault()
    await updateProfile(profile)
    setSavedNote('Profile changes are kept on this screen only. They are not saved to an account yet.')
  }

  function onPassword(event) {
    event.preventDefault()
    setPasswords({ next: '', confirm: '' })
    setPasswordNote('Password changes will be available when the account API is connected.')
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <form className="space-y-4" onSubmit={onSave}>
        <Card>
          <h2 className="text-h3 text-foreground">Personal Information</h2>
          <div className="mt-5 flex items-center gap-4">
            {profile.photo ? (
              <img src={assetSrc(profile.photo)} alt="" className="size-16 rounded-full object-cover" />
            ) : (
              <span className="grid size-16 place-items-center rounded-full bg-primary text-lg font-semibold text-white">{initials(profile)}</span>
            )}
            <div>
              <label htmlFor="profile-photo" className="text-small font-semibold text-foreground">
                Profile picture
              </label>
              <input id="profile-photo" type="file" accept="image/*" className="mt-2 block w-full text-small text-muted" onChange={onPhoto} />
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input id="profile-first" label="First Name" value={profile.firstName} onChange={updateField('firstName')} />
            <Input id="profile-last" label="Last Name" value={profile.lastName} onChange={updateField('lastName')} />
            <Input id="profile-email" label="Email" type="email" value={profile.email} onChange={updateField('email')} />
            <Input id="profile-phone" label="Phone" value={profile.phone} onChange={updateField('phone')} />
            <Input id="profile-country" label="Country" value={profile.country} onChange={updateField('country')} />
          </div>
          <div className="mt-5">
            <Button type="submit">Save profile</Button>
          </div>
          {savedNote ? <p className="mt-3 text-small text-muted">{savedNote}</p> : null}
        </Card>

        <Card>
          <h2 className="text-h3 text-foreground">Preferences</h2>
          <div className="mt-4 space-y-3">
            <Checkbox id="pref-email" label="Email Notifications" checked={profile.preferences.email} onChange={updatePreference('email')} />
            <Checkbox id="pref-sms" label="SMS Notifications" checked={profile.preferences.sms} onChange={updatePreference('sms')} />
            <Checkbox id="pref-marketing" label="Marketing Notifications" checked={profile.preferences.marketing} onChange={updatePreference('marketing')} />
          </div>
        </Card>
      </form>

      <Card>
        <h2 className="text-h3 text-foreground">Security</h2>
        <p className="mt-2 text-small text-muted">Change Password</p>
        <form className="mt-4 space-y-4" onSubmit={onPassword}>
          <Input
            id="profile-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={passwords.next}
            onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))}
          />
          <Input
            id="profile-confirm"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={passwords.confirm}
            onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))}
          />
          <Button type="submit" variant="outline">
            Change Password
          </Button>
          {passwordNote ? <p className="text-small text-muted">{passwordNote}</p> : null}
        </form>
      </Card>
    </div>
  )
}
