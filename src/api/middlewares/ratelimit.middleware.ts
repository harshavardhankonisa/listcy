import 'server-only'

import type { RateLimitConfig, RateLimitInfo } from '@/api/types'

/**
 * Internal application-level rate limiter (sliding window, in-memory).
 *
 * This is a safety net — Cloudflare handles external traffic.
 * Swap the `store` Map for a Redis client when running multiple instances.
 *
 * Preset limits:
 *   read  — 120 req/min per identifier (generous, Cloudflare is primary)
 *   write — 30 req/min per userId      (protects write operations)
 *   auth  — 10 req/min per IP          (additional guard on auth endpoints)
 */

export const RATE_LIMITS = {
  read: { windowMs: 60_000, max: 120 },
  write: { windowMs: 60_000, max: 30 },
  auth: { windowMs: 60_000, max: 10 },
} as const satisfies Record<string, RateLimitConfig>

// ── In-memory store ───────────────────────────────────────────────────────────
// Replace this section with a Redis adapter to support horizontal scaling.

interface Entry {
  count: number
  reset: number // unix ms
}

const store = new Map<string, Entry>()

let lastCleanup = Date.now()

/** Prune expired entries to prevent unbounded memory growth. */
function maybeCleanup() {
  const now = Date.now()
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.reset <= now) store.delete(key)
  }
}

// ── Core ──────────────────────────────────────────────────────────────────────

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

// ── IP extraction ─────────────────────────────────────────────────────────────

/**
 * Extract the real client IP from request headers.
 *
 * WHY THE ORDER MATTERS: x-forwarded-for is a client-controlled header — any
 * requester can prepend a fake IP to the list before it reaches the origin.
 * Trusting the first entry (as the previous implementation did) meant an
 * attacker could set x-forwarded-for: 1.2.3.4 and bypass per-IP rate limits
 * by rotating the spoofed value on every request.
 *
 * CF-Connecting-IP is written by Cloudflare on every inbound request and
 * stripped/replaced for traffic coming through the proxy — clients have no
 * way to control its value. Using it as the primary source gives us a
 * tamper-proof IP when the app sits behind Cloudflare.
 *
 * x-real-ip is set by nginx/Vercel infrastructure (single value, not a chain)
 * and serves as a reliable fallback when Cloudflare is not in the path.
 *
 * x-forwarded-for is kept as a last resort only, since it is better than
 * nothing in local/dev environments where neither of the above headers exist.
 *
 * WHERE: Used as the rate-limit identifier for public endpoints that have no
 * authenticated userId to key on (e.g. /tags). Not used for write endpoints —
 * those key on session.user.id, which cannot be spoofed.
 */
export function getIp(request: Request): string {
  // Cloudflare overwrites this on every request — cannot be spoofed.
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) return cfIp

  // Set by nginx / Vercel edge — single value, more reliable than a chain.
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp

  // Last resort: take the first entry; acceptable in local/dev environments.
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return 'unknown'
}
