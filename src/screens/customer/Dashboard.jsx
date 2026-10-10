import { useEffect, useState } from 'react'
import { ActiveRentalCard } from '@/components/customer/ActiveRentalCard'
import { CustomerNotificationPreview } from '@/components/customer/CustomerNotificationPreview'
import { CustomerStats } from '@/components/customer/CustomerStats'
import { CustomerWelcome } from '@/components/customer/CustomerWelcome'
import { PaymentSummary } from '@/components/customer/PaymentSummary'
import { QuickActions } from '@/components/customer/QuickActions'
import { RecentBookings } from '@/components/customer/RecentBookings'
import { UpcomingBookingCard } from '@/components/customer/UpcomingBookingCard'
import { getDashboard } from '@/services/customerService'

const empty = {
  stats: {},
  activeRental: null,
  upcomingBooking: null,
  recentBookings: [],
  paymentSummary: null,
  notifications: [],
}

export default function Dashboard() {
  const [data, setData] = useState(empty)

  useEffect(() => {
    let active = true
    getDashboard().then((next) => {
      if (active) setData(next)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <CustomerWelcome />
      <CustomerStats stats={data.stats} />
      <div className="grid items-stretch gap-4 xl:grid-cols-2">
        <ActiveRentalCard booking={data.activeRental} />
        <UpcomingBookingCard booking={data.upcomingBooking} />
      </div>
      <RecentBookings bookings={data.recentBookings} />
      <div className="grid gap-6 xl:grid-cols-2">
        <PaymentSummary summary={data.paymentSummary} />
        <QuickActions />
      </div>
      <CustomerNotificationPreview notifications={data.notifications} />
    </div>
  )
}
