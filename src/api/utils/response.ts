import 'server-only'

import { NextResponse } from 'next/server'
import type { ApiError, RateLimitInfo } from '@/api/types'

/** 200 OK */
export function ok<T>(data: T) {
  return NextResponse.json(data, { status: 200 })
}

/** 201 Created */
export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 })
}

/** 400 Bad Request */
export function badRequest(error: string, details?: unknown) {
  const body: ApiError = details ? { error, details } : { error }
  return NextResponse.json(body, { status: 400 })
}

/** 401 Unauthorized */
export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' } satisfies ApiError, {
    status: 401,
  })
}

/** 403 Forbidden */
export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' } satisfies ApiError, {
    status: 403,
  })
}

/** 404 Not Found */
export function notFound(error = 'Not found') {
  return NextResponse.json({ error } satisfies ApiError, { status: 404 })
}

/** 429 Too Many Requests — sets rate limit headers for observability */
export function tooManyRequests(info: RateLimitInfo) {
  return NextResponse.json({ error: 'Too many requests' } satisfies ApiError, {
    status: 429,
    headers: {
      'X-RateLimit-Limit': String(info.limit),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(info.reset),
      'Retry-After': String(Math.ceil((info.reset - Date.now()) / 1000)),
    },
  })
}

/** 500 Internal Server Error */
export function serverError(error = 'Internal server error') {
  return NextResponse.json({ error } satisfies ApiError, { status: 500 })
}

export async function parseBody<T = unknown>(
  request: Request
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  try {
    const data = (await request.json()) as T
    return { ok: true, data }
  } catch {
    return { ok: false, response: badRequest('Invalid JSON body') }
  }
}

export async function withController(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn()
  } catch (err) {
    console.error('[API] Unhandled controller error:', err)
    return serverError()
  }
}
