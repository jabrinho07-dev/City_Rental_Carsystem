import { BrandMark } from '@/components/common/BrandMark'
import { Spinner } from '@/components/ui/Spinner'

export function AuthLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <BrandMark />
        <Spinner size="lg" label="Loading your account" />
        <p className="text-small text-muted">Loading your account...</p>
      </div>
    </div>
  )
}
