import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { PublicPage } from '@/components/common/PlaceholderPage'
import { AuthCard, FormNotice } from '@/components/forms/AuthCard'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { routes } from '@/constants/routes'

const resetSchema = z.object({
  email: z.email('Enter a valid email address'),
})

export default function ForgotPasswordPage() {
  const [acknowledged, setAcknowledged] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' },
  })

  return (
    <PublicPage>
      <AuthCard
        title="Reset your password"
        description="We will use this address when password recovery is connected. No email is sent from this screen."
        footer={
          <p>
            Remembered it?{' '}
            <Link to={routes.login} className="font-semibold text-ink hover:underline">
              Return to log in
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(() => setAcknowledged(true))} noValidate>
          <FormField label="Email" htmlFor="reset-email" error={errors.email?.message}>
            <Input id="reset-email" type="email" autoComplete="email" {...register('email')} />
          </FormField>
          {acknowledged ? (
            <FormNotice>The form is valid. Password recovery will be connected in a later module.</FormNotice>
          ) : null}
          <Button type="submit" className="w-full">
            Request reset
          </Button>
        </form>
      </AuthCard>
    </PublicPage>
  )
}
