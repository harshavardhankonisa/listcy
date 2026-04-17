import 'server-only'

import { auth } from '@/api/config/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Types

type AuthSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

// WHY discriminated union: the two fields (session, error) are always
// correlated — when error is non-null, session is null, and vice versa.
// Expressing this as a union lets TypeScript enforce the correlation in callers.
//
// KNOWN LIMITATION — destructuring breaks narrowing:
//   const { session, error } = await requireSession()
//   if (error) return error
//   session.user.id  ← TypeScript still sees session as AuthSession | null
//                        because destructuring severs the union correlation.
//
// The null-as-never cast is the conventional workaround for this TypeScript
// limitation. It is safe at runtime because any caller that checks `error`
// before using `session` will never reach the null value. If you prefer fully
// type-safe code, use the non-destructuring pattern:
//   const auth = await requireSession()
//   if (auth.error) return auth.error
//   auth.session.user.id  ← correctly non-null here
export type RequireSessionResult =
  | { session: AuthSession; error: null }
  | { session: null; error: NextResponse }

// requireSession

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

// getOptionalSession

export async function getOptionalSession(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.id ?? null
  } catch (err) {
    console.error('[Auth] Optional session check failed:', err)
    return null
  }
}
