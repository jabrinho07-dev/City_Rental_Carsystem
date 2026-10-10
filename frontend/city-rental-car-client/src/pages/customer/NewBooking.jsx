import { zodResolver } from '@hookform/resolvers/zod'
import { CarFront } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { BookingActions } from '@/components/booking/BookingActions'
import { BookingDetailsForm } from '@/components/booking/BookingDetailsForm'
import { BookingExtras } from '@/components/booking/BookingExtras'
import { BookingPriceSummary } from '@/components/booking/BookingPriceSummary'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingTerms } from '@/components/booking/BookingTerms'
import { BookingVehicleCard } from '@/components/booking/BookingVehicleCard'
import { CustomerInformationForm } from '@/components/booking/CustomerInformationForm'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { bookingSchema, bookingSteps } from '@/constants/bookingOptions'
import { findMockVehicle } from '@/constants/mockVehicles'
import { rentalExtras } from '@/constants/vehicleOptions'
import { routes } from '@/constants/routes'
import { buildBooking, clearBookingDraft, getCurrentCustomer, readBookingDraft, saveBookingDraft, submitBooking } from '@/services/bookingService'
import { calculateRentalDays, calculateTotalPrice } from '@/utils/bookingPrice'

function BookingStart() {
  return (
    <Card className="mx-auto max-w-xl text-center">
      <CarFront className="mx-auto text-accent" size={28} aria-hidden="true" />
      <h1 className="text-h2 mt-4 text-foreground">Let's start your booking</h1>
      <p className="mt-3 text-body text-muted">Please select a vehicle before continuing.</p>
      <div className="mt-6">
        <Button to={routes.cars}>Browse Cars</Button>
      </div>
    </Card>
  )
}

export default function NewBooking() {
  const location = useLocation()
  const navigate = useNavigate()
  const draft = location.state?.vehicleId ? location.state : readBookingDraft()
  const vehicle = draft?.vehicleId ? findMockVehicle(draft.vehicleId) : null

  useEffect(() => {
    if (location.state?.vehicleId) saveBookingDraft(location.state)
  }, [location.state])
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const customer = getCurrentCustomer()

  const {
    register,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      pickupLocation: '',
      dropoffLocation: '',
      pickupDate: draft?.pickupDate || '',
      returnDate: draft?.returnDate || '',
      pickupTime: draft?.pickupTime || '',
      returnTime: draft?.returnTime || '',
      extras: Array.isArray(draft?.extras) ? draft.extras.map((extra) => extra.id || extra) : [],
      acceptedTerms: false,
      ...customer,
    },
  })

  const pickupDate = watch('pickupDate')
  const returnDate = watch('returnDate')
  const selectedIds = watch('extras')
  const selectedExtras = rentalExtras.filter((extra) => selectedIds.includes(extra.id))
  const days = calculateRentalDays(pickupDate, returnDate)
  const pricing = useMemo(
    () =>
      calculateTotalPrice({
        dailyRate: vehicle?.pricePerDay || 0,
        weeklyRate: vehicle?.pricePerWeek || 0,
        monthlyRate: vehicle?.pricePerMonth || (vehicle ? vehicle.pricePerWeek * 4 : 0),
        days,
        extras: selectedExtras,
      }),
    [days, selectedExtras, vehicle],
  )

  if (!vehicle) return <BookingStart />

  function toggleExtra(id) {
    const current = getValues('extras')
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    setValue('extras', next, { shouldDirty: true })
  }

  async function continueStep() {
    const fields = bookingSteps[step - 1].fields
    const valid = fields.length === 0 ? true : await trigger(fields)
    if (!valid) return
    setStep((current) => Math.min(current + 1, 4))
    window.scrollTo(0, 0)
  }

  function goBack() {
    if (step === 1) {
      navigate(routes.car(vehicle.id))
      return
    }
    setStep((current) => current - 1)
    window.scrollTo(0, 0)
  }

  async function confirmBooking() {
    if (submitting) return
    const valid = await trigger()
    if (!valid) {
      const parsed = bookingSchema.safeParse(getValues())
      const paths = parsed.success ? [] : parsed.error.issues.map((issue) => String(issue.path[0]))
      const firstInvalid = bookingSteps.find((item) => item.fields.some((field) => paths.includes(field)))
      if (firstInvalid) setStep(bookingSteps.indexOf(firstInvalid) + 1)
      return
    }

    setSubmitting(true)
    try {
      const booking = buildBooking({ values: getValues(), vehicle, pricing })
      await submitBooking(booking)
      clearBookingDraft()
      navigate(`${routes.customer.booking(booking.id)}/confirmation`, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-20 lg:pb-0">
      <h1 className="text-h2 text-foreground">Complete your booking</h1>
      <p className="mt-2 text-small text-muted">This request is saved in this browser until the booking API is connected.</p>
      <div className="mt-6">
        <BookingStepper
          steps={bookingSteps}
          current={step}
          onSelect={(number) => {
            if (number < step) setStep(number)
          }}
        />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form className="min-w-0 space-y-6" noValidate onSubmit={(event) => event.preventDefault()}>
          {step === 1 ? (
            <section aria-labelledby="booking-vehicle-heading" className="space-y-4">
              <h2 id="booking-vehicle-heading" className="text-h3 text-foreground lg:sr-only">
                Vehicle
              </h2>
              <div className="lg:hidden">
                <BookingVehicleCard vehicle={vehicle} />
              </div>
              <p className="hidden text-body text-muted lg:block">
                Review {vehicle.brand} {vehicle.model} in the summary, then continue with the rental details.
              </p>
            </section>
          ) : null}
          {step === 2 ? <BookingDetailsForm register={register} errors={errors} pickupDate={pickupDate} /> : null}
          {step === 3 ? <CustomerInformationForm register={register} errors={errors} /> : null}
          {step === 4 ? (
            <div className="space-y-6">
              <BookingExtras selectedIds={selectedIds} days={pricing.days} onToggle={toggleExtra} />
              <div className="lg:hidden">
                <BookingPriceSummary pricing={pricing} />
              </div>
              <BookingTerms register={register} error={errors.acceptedTerms?.message} />
            </div>
          ) : null}

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface p-3 lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0">
            <BookingActions step={step} onBack={goBack} onContinue={continueStep} onConfirm={confirmBooking} submitting={submitting} />
          </div>
        </form>

        <aside className="hidden lg:sticky lg:top-20 lg:block lg:space-y-4">
          <BookingVehicleCard vehicle={vehicle} />
          <BookingPriceSummary pricing={pricing} />
        </aside>
      </div>
    </div>
  )
}
