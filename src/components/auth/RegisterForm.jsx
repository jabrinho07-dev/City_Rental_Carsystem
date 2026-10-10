import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PasswordField } from '@/components/auth/PasswordField'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { AuthError } from '@/services/authService'

const schema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required.').min(2, 'Use at least 2 characters.'),
    lastName: z.string().trim().min(1, 'Last name is required.').min(2, 'Use at least 2 characters.'),
    email: z.email('Enter a valid email address.'),
    phone: z.string().trim().min(1, 'Phone number is required.'),
    country: z.string().trim().min(1, 'Country is required.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    acceptedTerms: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match.' })
    }
    if (!values.acceptedTerms) {
      context.addIssue({ code: 'custom', path: ['acceptedTerms'], message: 'Please agree to the terms to create an account.' })
    }
  })

export function RegisterForm({ onSubmit }) {
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    },
  })

  async function submit(values) {
    setFormError('')
    try {
      await onSubmit(values)
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : 'Something went wrong while creating the account. Please try again.')
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit(submit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="register-first-name" label="First Name" autoComplete="given-name" placeholder="Abdi" error={errors.firstName?.message} {...register('firstName')} />
        <Input id="register-last-name" label="Last Name" autoComplete="family-name" placeholder="Mohamed" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Input id="register-email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="register-phone" label="Phone Number" type="tel" autoComplete="tel" placeholder="+252 61 000 0000" error={errors.phone?.message} {...register('phone')} />
        <Input id="register-country" label="Country" autoComplete="country-name" placeholder="Somalia" error={errors.country?.message} {...register('country')} />
      </div>
      <PasswordField id="register-password" label="Password" autoComplete="new-password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} />
      <PasswordField id="register-confirm" label="Confirm Password" autoComplete="new-password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Checkbox id="register-terms" label="I agree to the rental terms and conditions." error={errors.acceptedTerms?.message} {...register('acceptedTerms')} />
      {formError ? (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-small text-danger" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
