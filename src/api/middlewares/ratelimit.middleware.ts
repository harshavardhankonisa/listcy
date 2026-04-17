import 'server-only'

import type { RateLimitConfig, RateLimitInfo } from '@/api/types'

export const RATE_LIMITS = {
  read: { windowMs: 60000, max: 120 },
  write: { windowMs: 60000, max: 30 },
  auth: { windowMs: 60000, max: 10 },
} as const satisfies Record<string, RateLimitConfig>

// TODO: Replace this section with a Redis adapter to support horizontal scaling.
interface Entry {
  count: number
  reset: number
}

const store = new Map<string, Entry>()

let lastCleanup = Date.now()

function maybeCleanup() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.reset <= now) store.delete(key)
  }
}

/**
 * Check and increment the rate limit counter for a given identifier.
 *
 * @param identifier - userId for write ops, IP for read/auth ops
 * @param config     - window + max from RATE_LIMITS
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitInfo> {
  maybeCleanup()

  const now = Date.now()
  const key = `rl:${identifier}:${config.max}:${config.windowMs}`
  const entry = store.get(key)

  if (!entry || entry.reset <= now) {
    store.set(key, { count: 1, reset: now + config.windowMs })
    return {
      allowed: true,
      remaining: config.max - 1,
      reset: now + config.windowMs,
      limit: config.max,
    }
  }

  if (entry.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      reset: entry.reset,
      limit: config.max,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: config.max - entry.count,
    reset: entry.reset,
    limit: config.max,
  }
}

export function getIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp

  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return 'unknown'
}
