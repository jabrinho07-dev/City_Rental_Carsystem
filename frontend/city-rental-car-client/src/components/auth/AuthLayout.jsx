import { BrandMark } from '@/components/common/BrandMark'
import heroImage from '@/assets/hero-sedan.jpg'

export function AuthLayout({ children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card lg:grid lg:min-h-[40rem] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary text-white lg:flex lg:flex-col lg:justify-between lg:p-10">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-primary/75" aria-hidden="true" />
        <div className="relative">
          <BrandMark tone="light" />
        </div>
        <div className="relative max-w-md">
          <p className="text-caption font-semibold tracking-[0.16em] text-accent uppercase">City Rental Car</p>
          <h2 className="text-h2 mt-3 text-white">Premium vehicles, ready when you are.</h2>
          <p className="mt-3 text-small leading-6 text-white/75">
            Sign in to manage bookings, vehicles, and your rental account.
          </p>
        </div>
      </div>
      <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">{children}</div>
    </div>
  )
}
