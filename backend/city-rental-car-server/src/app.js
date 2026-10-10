import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js'
import apiRoutes from './routes/index.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({
    origin: env.clientUrl,
    credentials: true,
  }))
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'City Rental Car API is running',
      health: '/api/health',
    })
  })

  app.get('/favicon.ico', (req, res) => {
    res.status(204).end()
  })

  app.use('/api', apiRoutes)
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
