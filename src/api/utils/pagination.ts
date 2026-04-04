import 'server-only'

import type { PaginationParams } from '@/api/types'

/**
 * Parse limit + offset from a URL's search params.
 * Clamps limit to [1, maxLimit] and offset to [0, ∞).
 */
export function parsePagination(url: URL, maxLimit = 50): PaginationParams {
  const limit = Math.min(
    Math.max(Number(url.searchParams.get('limit') ?? 20), 1),
    maxLimit
  )
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0)
  return { limit, offset }
}
