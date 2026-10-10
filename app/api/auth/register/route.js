import bcrypt from 'bcryptjs'
import { databaseUnavailable, isDatabaseDown, prisma } from '@/lib/db'

export async function POST(request) {
  if (!prisma) return databaseUnavailable()

  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()
  let existing
  try {
    existing = await prisma.user.findUnique({ where: { email } })
  } catch (error) {
    if (isDatabaseDown(error)) return databaseUnavailable()
    throw error
  }
  if (existing) {
    return Response.json({ code: 'EXISTS', message: 'An account with this email already exists.' }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: {
      firstName: String(body.firstName || '').trim(),
      lastName: String(body.lastName || '').trim(),
      email,
      phone: String(body.phone || '').trim(),
      country: String(body.country || '').trim(),
      role: 'CUSTOMER',
      passwordHash: await bcrypt.hash(String(body.password || ''), 10),
    },
  })

  return Response.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token: `session-${user.id}`,
  })
}
