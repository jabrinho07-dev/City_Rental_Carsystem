import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from '@/lib/router'
import { z } from 'zod'
import { PublicPage } from '@/components/common/PlaceholderPage'
import { AuthCard, FormNotice } from '@/components/forms/AuthCard'
import { FormField } from '@/components/forms/FormField'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { routes } from '@/constants/routes'

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters'),
})

export default function LoginPage() {
  const [acknowledged, setAcknowledged] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <PublicPage>
      <AuthCard
        title="Log in"
        description="Enter your account details. Sign-in is not connected yet, so this screen only checks the form."
        footer={
          <p>
            New to City Rental Car?{' '}
            <Link to={routes.register} className="font-semibold text-ink hover:underline">
              Create an account
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(() => setAcknowledged(true))} noValidate>
          <FormField label="Email" htmlFor="login-email" error={errors.email?.message}>
            <Input id="login-email" type="email" autoComplete="email" {...register('email')} />
          </FormField>
          <FormField label="Password" htmlFor="login-password" error={errors.password?.message}>
            <Input id="login-password" type="password" autoComplete="current-password" {...register('password')} />
          </FormField>
          <div className="text-right">
            <Link to={routes.forgotPassword} className="text-sm font-medium text-ink-soft hover:underline">
              Forgot password?
            </Link>
          </div>
          {acknowledged ? (
            <FormNotice>The form is valid. Authentication will be connected in a later module.</FormNotice>
          ) : null}
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </AuthCard>
    </PublicPage>
  )
}
