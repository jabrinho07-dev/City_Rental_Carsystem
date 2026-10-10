import { Link } from 'react-router-dom'
import { Checkbox } from '@/components/ui/Checkbox'
import { routes } from '@/constants/routes'

export function BookingTerms({ register, error }) {
  return (
    <section aria-labelledby="booking-terms-heading" className="space-y-3">
      <h2 id="booking-terms-heading" className="text-h3 text-foreground">
        Terms & Conditions
      </h2>
      <Checkbox
        id="accept-terms"
        label="I agree to the rental terms and conditions."
        error={error}
        {...register('acceptedTerms')}
      />
      <p className="text-small text-muted">
        <Link to={routes.contact} className="font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Terms & Conditions
        </Link>
        <span aria-hidden="true"> · </span>
        <Link to={routes.contact} className="font-semibold text-foreground underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Privacy Policy
        </Link>
      </p>
    </section>
  )
}
