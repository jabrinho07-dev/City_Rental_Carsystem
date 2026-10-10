import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

const app = createApp()

try {
  await connectDB()
} catch (error) {
  console.error(`MongoDB connection failed: ${error.message}`)
}

const server = app.listen(env.port, () => {
  console.log(`City Rental Car API listening on port ${env.port}`)
})

function shutdown(signal) {
  console.log(`${signal} received. Closing server.`)
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
