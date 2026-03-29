import { auth } from '@/api/config/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Get the authenticated session from the request.
 * Returns the session or a 401 NextResponse.
 */
export async function requireSession() {
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
