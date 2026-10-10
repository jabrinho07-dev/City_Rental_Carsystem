import { Outlet, Route, Routes } from '@/lib/router'
import { AuthLoading } from '@/components/auth/AuthLoading'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { RoleRoute } from '@/components/auth/RoleRoute'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/layouts/AdminLayout'
import CustomerLayout from '@/layouts/CustomerLayout'
import PublicLayout from '@/layouts/PublicLayout'
import BookingsAdminPage from '@/screens/admin/BookingsPage'
import CustomersPage from '@/screens/admin/CustomersPage'
import AdminProfile from '@/screens/admin/AdminProfile'
import AdminDashboard from '@/screens/admin/Dashboard'
import EditVehiclePage from '@/screens/admin/EditVehiclePage'
import ExpensesPage from '@/screens/admin/ExpensesPage'
import MaintenancePage from '@/screens/admin/MaintenancePage'
import NewVehiclePage from '@/screens/admin/NewVehiclePage'
import AdminPaymentsPage from '@/screens/admin/PaymentsPage'
import ReportsPage from '@/screens/admin/ReportsPage'
import SettingsPage from '@/screens/admin/SettingsPage'
import VehiclesPage from '@/screens/admin/VehiclesPage'
import BookingConfirmation from '@/screens/customer/BookingConfirmation'
import BookingDetails from '@/screens/customer/BookingDetails'
import NewBooking from '@/screens/customer/NewBooking'
import Dashboard from '@/screens/customer/Dashboard'
import MyBookings from '@/screens/customer/MyBookings'
import MyInvoices from '@/screens/customer/MyInvoices'
import MyPayments from '@/screens/customer/MyPayments'
import Notifications from '@/screens/customer/Notifications'
import Profile from '@/screens/customer/Profile'
import AboutPage from '@/screens/public/AboutPage'
import CarDetailsPage from '@/screens/public/CarDetailsPage'
import Cars from '@/screens/public/Cars'
import ContactPage from '@/screens/public/ContactPage'
import DesignSystemPage from '@/screens/public/DesignSystemPage'
import ForgotPassword from '@/screens/public/ForgotPassword'
import HomePage from '@/screens/public/HomePage'
import Login from '@/screens/public/Login'
import NotFoundPage from '@/screens/public/NotFoundPage'
import Register from '@/screens/public/Register'
import ResetPassword from '@/screens/public/ResetPassword'
import Unauthorized from '@/screens/public/Unauthorized'

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
