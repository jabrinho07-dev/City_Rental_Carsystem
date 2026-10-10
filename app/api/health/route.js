import { prisma } from '@/lib/db'

export async function GET() {
  return Response.json({
    ok: true,
    database: prisma ? 'postgresql' : 'not-configured',
  })
}
