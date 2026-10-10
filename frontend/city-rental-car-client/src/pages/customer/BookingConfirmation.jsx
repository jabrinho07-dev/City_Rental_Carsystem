import { useParams } from 'react-router-dom'
import { BookingStepper } from '@/components/booking/BookingStepper'
import { BookingSuccess } from '@/components/booking/BookingSuccess'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { bookingSteps } from '@/constants/bookingOptions'
import { routes } from '@/constants/routes'
import { getBooking } from '@/services/bookingService'

export default function BookingConfirmation() {
  const { id } = useParams()
  const booking = getBooking(id)

  if (!booking) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <h1 className="text-h2 text-foreground">Booking not found</h1>
        <p className="mt-3 text-body text-muted">This confirmation is not available in the current browser session.</p>
        <div className="mt-6">
          <Button to={routes.cars}>Browse Cars</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <BookingStepper steps={bookingSteps} current={5} />
      <BookingSuccess booking={booking} />
    </div>
  )
}
