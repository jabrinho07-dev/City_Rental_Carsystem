import dotenv from 'dotenv'

dotenv.config()

function read(name, fallback = '') {
  const value = process.env[name]
  if (value === undefined || value === null) return fallback
  return value.trim()
}

const port = Number(read('PORT', '5000'))

export const env = {
  nodeEnv: read('NODE_ENV', 'development'),
  port: Number.isInteger(port) && port > 0 ? port : 5000,
  mongodbUri: read('MONGODB_URI'),
  jwtSecret: read('JWT_SECRET'),
  clientUrl: read('CLIENT_URL', 'http://localhost:5173'),
}
