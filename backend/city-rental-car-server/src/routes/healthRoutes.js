import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'City Rental Car API is running',
  })
})

export default router
