import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma = process.env.DATABASE_URL
  ? globalForPrisma.prisma || new PrismaClient()
  : null

if (prisma) globalForPrisma.prisma = prisma

export function databaseUnavailable() {
  return Response.json(
    { code: 'UNAVAILABLE', message: 'Database is not configured yet.' },
    { status: 503 },
  )
}

export function isDatabaseDown(error) {
  return error?.name === 'PrismaClientInitializationError' || error?.code === 'P1001'
}
