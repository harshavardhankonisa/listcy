import 'server-only'

import { auth } from '@/api/config/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { RequireSessionResult } from '@/api/types'

export async function requireSession(): Promise<RequireSessionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      session: null as never,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { session, error: null }
}

export async function getOptionalSession(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.id ?? null
  } catch (err) {
    console.error('[Auth] Optional session check failed:', err)
    return null
  }
}
