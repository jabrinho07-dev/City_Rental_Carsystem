import {
  bookingStatusData,
  dashboardStats,
  headerNotices,
  recentActivity,
  recentBookings,
  recentCustomers,
  revenueDatasets,
  vehicleAvailabilityData,
} from '@/constants/mockAdminData'

export async function getDashboardStats() {
  return { ...dashboardStats }
}

export async function getRevenueData(range = '1y') {
  const rows = revenueDatasets[range] || revenueDatasets['1y']
  return rows.map((row) => ({ ...row }))
}

export async function getBookingAnalytics() {
  return bookingStatusData.map((row) => ({ ...row }))
}

export async function getVehicleAvailability() {
  return vehicleAvailabilityData.map((row) => ({ ...row }))
}

export async function getRecentBookings() {
  return recentBookings.map((row) => ({ ...row }))
}

export async function getRecentCustomers() {
  return recentCustomers.map((row) => ({ ...row }))
}

export async function getRecentActivity() {
  return recentActivity.map((row) => ({ ...row }))
}

export async function getHeaderNotices() {
  return headerNotices.map((row) => ({ ...row }))
}

export async function getDashboard() {
  const [stats, revenue, bookingStatus, availability, bookings, customers, activity] = await Promise.all([
    getDashboardStats(),
    getRevenueData('1y'),
    getBookingAnalytics(),
    getVehicleAvailability(),
    getRecentBookings(),
    getRecentCustomers(),
    getRecentActivity(),
  ])

  return { stats, revenue, bookingStatus, availability, bookings, customers, activity }
}
