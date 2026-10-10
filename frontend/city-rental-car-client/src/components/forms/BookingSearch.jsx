import { Calendar, Clock, MapPin, Search } from 'lucide-react'
import { useState } from 'react'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/Button'
import { DateInput } from '@/components/ui/DateInput'
import { Select } from '@/components/ui/Select'
import { TimeInput } from '@/components/ui/TimeInput'

const locations = [
  { value: 'city-center', label: 'City Center Desk' },
  { value: 'airport', label: 'Airport Terminal' },
  { value: 'harbor', label: 'Harbor Station' },
  { value: 'business-district', label: 'Business District' },
  { value: 'north-residence', label: 'North Residence' },
]

const nextPhaseMessage =
  'Search functionality will be connected to the vehicle API in the next development phase.'

function localISODate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

const today = localISODate(new Date())

const initialValues = {
  pickupLocation: '',
  dropoffLocation: '',
  pickupDate: '',
  returnDate: '',
  pickupTime: '',
  returnTime: '',
}

function validate(values) {
  const nextErrors = {}

  if (!values.pickupLocation) nextErrors.pickupLocation = 'Choose a pickup location.'
  if (!values.dropoffLocation) nextErrors.dropoffLocation = 'Choose a drop-off location.'

  if (!values.pickupDate) {
    nextErrors.pickupDate = 'Choose a pickup date.'
  } else if (values.pickupDate < today) {
    nextErrors.pickupDate = 'Pickup date cannot be in the past.'
  }

  if (!values.returnDate) {
    nextErrors.returnDate = 'Choose a return date.'
  } else if (values.pickupDate && values.returnDate < values.pickupDate) {
    nextErrors.returnDate = 'Return date cannot be earlier than the pickup date.'
  }

  return nextErrors
}

function FieldIcon({ icon: Icon }) {
  return <Icon className="pointer-events-none absolute top-10 left-3 text-muted" size={16} aria-hidden="true" />
}

export function BookingSearch() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setNotice('')
  }

  function onSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setNotice('')
      return
    }

    setNotice(nextPhaseMessage)
  }

  const returnMin = values.pickupDate && values.pickupDate > today ? values.pickupDate : today

  return (
    <section id="booking-search" aria-label="Search rental cars" className="scroll-mt-24">
      <Container className="relative z-20 -mt-6 pb-16 sm:-mt-8 lg:-mt-16 lg:pb-24">
        <form
          onSubmit={onSubmit}
          noValidate
          className="fade-up rounded-xl border border-border bg-surface p-4 shadow-float sm:p-6"
        >
          <div className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end">
            <div className="relative">
              <FieldIcon icon={MapPin} />
              <Select
                id="pickup-location"
                label="Pickup location"
                placeholder="Select location"
                options={locations}
                value={values.pickupLocation}
                error={errors.pickupLocation}
                className="pl-9"
                onChange={(event) => update('pickupLocation', event.target.value)}
              />
            </div>
            <div className="relative">
              <FieldIcon icon={MapPin} />
              <Select
                id="dropoff-location"
                label="Drop-off location"
                placeholder="Select location"
                options={locations}
                value={values.dropoffLocation}
                error={errors.dropoffLocation}
                className="pl-9"
                onChange={(event) => update('dropoffLocation', event.target.value)}
              />
            </div>
            <div className="relative">
              <FieldIcon icon={Calendar} />
              <DateInput
                id="pickup-date"
                label="Pickup date"
                min={today}
                value={values.pickupDate}
                error={errors.pickupDate}
                className="pl-9"
                onChange={(event) => update('pickupDate', event.target.value)}
              />
            </div>
            <div className="relative">
              <FieldIcon icon={Calendar} />
              <DateInput
                id="return-date"
                label="Return date"
                min={returnMin}
                value={values.returnDate}
                error={errors.returnDate}
                className="pl-9"
                onChange={(event) => update('returnDate', event.target.value)}
              />
            </div>
            <Button type="submit" icon={Search} className="w-full lg:w-auto lg:px-6">
              Search Cars
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
            <div className="relative">
              <FieldIcon icon={Clock} />
              <TimeInput
                id="pickup-time"
                label="Pickup time"
                hint="Optional"
                value={values.pickupTime}
                className="pl-9"
                onChange={(event) => update('pickupTime', event.target.value)}
              />
            </div>
            <div className="relative">
              <FieldIcon icon={Clock} />
              <TimeInput
                id="return-time"
                label="Return time"
                hint="Optional"
                value={values.returnTime}
                className="pl-9"
                onChange={(event) => update('returnTime', event.target.value)}
              />
            </div>
          </div>

          {notice ? (
            <p className="text-small mt-4 text-foreground" role="status">
              {notice}
            </p>
          ) : null}
        </form>
      </Container>
    </section>
  )
}
