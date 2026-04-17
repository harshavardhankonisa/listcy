import 'server-only'

/**
 * Shared backend types.
 *
 * Designed to map cleanly to Rust structs when services migrate to microservices.
 * Keep types flat, explicit, and serialisation-friendly — no class instances,
 * no circular references, no Next.js-specific types.
 */

// Pagination
export interface PaginationParams {
  limit: number
  offset: number
}

export interface PaginatedResponse<T> {
  items: T[]
  limit: number
  offset: number
  total?: number
}

// Errors

export interface ApiError {
  error: string
  details?: unknown
}

// Rate limiting

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number
  /** Max requests allowed within the window */
  max: number
}

export interface RateLimitInfo {
  allowed: boolean
  remaining: number
  /** Unix timestamp (ms) when the current window resets */
  reset: number
  limit: number
}

// Session

/** Minimal user shape extracted from a Better Auth session. */
export interface SessionUser {
  id: string
  email: string
  name: string | null
}
