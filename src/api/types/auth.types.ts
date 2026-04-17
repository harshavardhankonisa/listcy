import { auth } from '@/api/config/auth'
import { NextResponse } from 'next/server'

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>

export type RequireSessionResult =
  | { session: AuthSession; error: null }
  | { session: null; error: NextResponse }
