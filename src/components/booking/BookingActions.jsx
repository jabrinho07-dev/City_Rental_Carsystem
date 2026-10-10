import { Button } from '@/components/ui/Button'

export function BookingActions({ step, onBack, onContinue, onConfirm, submitting }) {
  const isReview = step === 4

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline" className="h-auto min-h-11 whitespace-normal px-2 text-center" onClick={onBack} disabled={submitting}>
        Back
      </Button>
      {isReview ? (
        <Button type="button" className="h-auto min-h-11 whitespace-normal px-2 text-center" onClick={onConfirm} loading={submitting} disabled={submitting}>
          {submitting ? 'Submitting Booking...' : 'Confirm Booking'}
        </Button>
      ) : (
        <Button type="button" className="h-auto min-h-11 whitespace-normal px-2 text-center" onClick={onContinue} disabled={submitting}>
          Continue
        </Button>
      )}
    </div>
  )
}
