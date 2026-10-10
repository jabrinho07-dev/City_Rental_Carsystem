import { Router } from 'express'
import authRoutes from './authRoutes.js'
import bookingRoutes from './bookingRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import expenseRoutes from './expenseRoutes.js'
import healthRoutes from './healthRoutes.js'
import invoiceRoutes from './invoiceRoutes.js'
import maintenanceRoutes from './maintenanceRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import reportRoutes from './reportRoutes.js'
import userRoutes from './userRoutes.js'
import vehicleRoutes from './vehicleRoutes.js'

const router = Router()

router.use(healthRoutes)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/vehicles', vehicleRoutes)
router.use('/categories', categoryRoutes)
router.use('/bookings', bookingRoutes)
router.use('/payments', paymentRoutes)
router.use('/invoices', invoiceRoutes)
router.use('/maintenance', maintenanceRoutes)
router.use('/expenses', expenseRoutes)
router.use('/reports', reportRoutes)
router.use('/notifications', notificationRoutes)

export default router
