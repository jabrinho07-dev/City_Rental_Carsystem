import { Outlet, Route, Routes } from 'react-router-dom'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleRoute } from '@/components/auth/RoleRoute'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/layouts/AdminLayout'
import CustomerLayout from '@/layouts/CustomerLayout'
import PublicLayout from '@/layouts/PublicLayout'
import BookingsAdminPage from '@/pages/admin/BookingsPage'
import CustomersPage from '@/pages/admin/CustomersPage'
import AdminProfile from '@/pages/admin/AdminProfile'
import AdminDashboard from '@/pages/admin/Dashboard'
import EditVehiclePage from '@/pages/admin/EditVehiclePage'
import ExpensesPage from '@/pages/admin/ExpensesPage'
import MaintenancePage from '@/pages/admin/MaintenancePage'
import NewVehiclePage from '@/pages/admin/NewVehiclePage'
import AdminPaymentsPage from '@/pages/admin/PaymentsPage'
import ReportsPage from '@/pages/admin/ReportsPage'
import SettingsPage from '@/pages/admin/SettingsPage'
import VehiclesPage from '@/pages/admin/VehiclesPage'
import BookingConfirmation from '@/pages/customer/BookingConfirmation'
import BookingDetails from '@/pages/customer/BookingDetails'
import NewBooking from '@/pages/customer/NewBooking'
import Dashboard from '@/pages/customer/Dashboard'
import MyBookings from '@/pages/customer/MyBookings'
import MyInvoices from '@/pages/customer/MyInvoices'
import MyPayments from '@/pages/customer/MyPayments'
import Notifications from '@/pages/customer/Notifications'
import Profile from '@/pages/customer/Profile'
import AboutPage from '@/pages/public/AboutPage'
import CarDetailsPage from '@/pages/public/CarDetailsPage'
import Cars from '@/pages/public/Cars'
import ContactPage from '@/pages/public/ContactPage'
import DesignSystemPage from '@/pages/public/DesignSystemPage'
import ForgotPassword from '@/pages/public/ForgotPassword'
import HomePage from '@/pages/public/HomePage'
import Login from '@/pages/public/Login'
import NotFoundPage from '@/pages/public/NotFoundPage'
import Register from '@/pages/public/Register'
import ResetPassword from '@/pages/public/ResetPassword'
import Unauthorized from '@/pages/public/Unauthorized'

function AuthGate() {
  const { isLoading } = useAuth()
  if (isLoading) return <AuthLoading />
  return <Outlet />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthGate />}>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="design-system" element={<DesignSystemPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={['CUSTOMER']} />}>
      <Route path="customer" element={<CustomerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/new" element={<NewBooking />} />
        <Route path="bookings/:id/confirmation" element={<BookingConfirmation />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
        <Route path="payments" element={<MyPayments />} />
        <Route path="invoices" element={<MyInvoices />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
      </Route>

      <Route element={<RoleRoute allowedRoles={['STAFF', 'ADMIN']} />}>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="vehicles/new" element={<NewVehiclePage />} />
        <Route path="vehicles/:id/edit" element={<EditVehiclePage />} />
        <Route path="bookings" element={<BookingsAdminPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>
      </Route>
      </Route>
      </Route>
    </Routes>
  )
}
