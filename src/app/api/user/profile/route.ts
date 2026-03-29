import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as userService from '@/api/services/user.service'

export async function GET() {
  const { session, error } = await requireSession()
  if (error) return error

  const profile = await userService.getProfile(session.user.id)
  return NextResponse.json({ profile })
}

export async function PATCH(request: Request) {
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()
  const allowed = [
    'displayName',
    'bio',
    'phone',
    'timezone',
    'locale',
    'avatarUrl',
  ] as const

  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {
      data[key] = body[key]
    }
  }

  const profile = await userService.upsertProfile(session.user.id, data)
  return NextResponse.json({ profile })
}
