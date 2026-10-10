import bcrypt from 'bcryptjs'
import { databaseUnavailable, isDatabaseDown, prisma } from '@/lib/db'

export async function POST(request) {
  if (!prisma) return databaseUnavailable()

  const body = await request.json()
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  let user
  try {
    user = await prisma.user.findUnique({ where: { email } })
  } catch (error) {
    if (isDatabaseDown(error)) return databaseUnavailable()
    throw error
  }
  const matches = user ? await bcrypt.compare(password, user.passwordHash) : false

  if (!matches) {
    return Response.json({ code: 'INVALID', message: 'Invalid email or password.' }, { status: 401 })
  }

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
