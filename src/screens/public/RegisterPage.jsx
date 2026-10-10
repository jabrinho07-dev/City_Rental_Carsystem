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

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.email('Enter a valid email address'),
    phone: z.string().min(7, 'Enter a phone number'),
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })

export default function RegisterPage() {
  const [acknowledged, setAcknowledged] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <PublicPage>
      <AuthCard
        title="Create an account"
        description="Tell us how to reach you. Registration does not create an account yet."
        footer={
          <p>
            Already registered?{' '}
            <Link to={routes.login} className="font-semibold text-ink hover:underline">
              Log in
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(() => setAcknowledged(true))} noValidate>
          <FormField label="Full name" htmlFor="register-name" error={errors.fullName?.message}>
            <Input id="register-name" autoComplete="name" {...register('fullName')} />
          </FormField>
          <FormField label="Email" htmlFor="register-email" error={errors.email?.message}>
            <Input id="register-email" type="email" autoComplete="email" {...register('email')} />
          </FormField>
          <FormField label="Phone" htmlFor="register-phone" error={errors.phone?.message}>
            <Input id="register-phone" type="tel" autoComplete="tel" {...register('phone')} />
          </FormField>
          <FormField label="Password" htmlFor="register-password" error={errors.password?.message}>
            <Input id="register-password" type="password" autoComplete="new-password" {...register('password')} />
          </FormField>
          <FormField label="Confirm password" htmlFor="register-confirm" error={errors.confirmPassword?.message}>
            <Input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
          </FormField>
          {acknowledged ? (
            <FormNotice>The form is valid. Account creation will be connected in a later module.</FormNotice>
          ) : null}
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </AuthCard>
    </PublicPage>
  )
}
