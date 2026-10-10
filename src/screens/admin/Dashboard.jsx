import { useEffect, useState } from 'react'
import { AdminQuickActions } from '@/components/admin/AdminQuickActions'
import { AdminStats } from '@/components/admin/AdminStats'
import { AdminWelcome } from '@/components/admin/AdminWelcome'
import { BookingOverview } from '@/components/admin/BookingOverview'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { RecentBookings } from '@/components/admin/RecentBookings'
import { RecentCustomers } from '@/components/admin/RecentCustomers'
import { RevenueOverview } from '@/components/admin/RevenueOverview'
import { VehicleAvailability } from '@/components/admin/VehicleAvailability'
import { getDashboard } from '@/services/adminService'

const empty = {
  stats: {},
  revenue: [],
  bookingStatus: [],
  availability: [],
  bookings: [],
  customers: [],
  activity: [],
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
      <AdminWelcome />
      <AdminStats stats={data.stats} />
      <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <RevenueOverview data={data.revenue} />
        <VehicleAvailability data={data.availability} />
      </div>
      <BookingOverview data={data.bookingStatus} />
      <RecentBookings bookings={data.bookings} />
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
        <RecentCustomers customers={data.customers} />
        <RecentActivity activity={data.activity} />
      </div>
      <AdminQuickActions />
    </div>
  )
}
