import { env } from '../config/env.js'

export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    next(err)
    return
  }

  const statusCode = err.statusCode || 500
  const message = statusCode === 500 && env.nodeEnv === 'production'
    ? 'Something went wrong'
    : err.message || 'Something went wrong'

  const error = err.error && typeof err.error === 'object' ? err.error : {}

  if (env.nodeEnv !== 'production' && statusCode === 500) {
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
    error,
  })
}
