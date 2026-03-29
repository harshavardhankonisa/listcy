import { NextResponse } from 'next/server'
import { requireSession } from '@/api/middlewares/auth.middleware'
import * as userService from '@/api/services/user.service'

export async function GET() {
  const { session, error } = await requireSession()
  if (error) return error

  const settings = await userService.getSettings(session.user.id)
  return NextResponse.json({ settings })
}

export async function PATCH(request: Request) {
  const { session, error } = await requireSession()
  if (error) return error

  const body = await request.json()
  const allowed = [
    'theme',
    'locale',
    'timezone',
    'emailNotifications',
    'pushNotifications',
  ] as const

  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) {
      data[key] = body[key]
    }
  }

  const settings = await userService.upsertSettings(session.user.id, data)
  return NextResponse.json({ settings })
}
