import 'server-only'

import {
  rateLimit,
  RATE_LIMITS,
  getIp,
} from '@/api/middlewares/ratelimit.middleware'
import * as tagService from '@/api/services/tag.service'
import * as res from '@/api/utils/response'
import type { ApiResponse } from '@/api/types'

export async function getTags(request: Request): ApiResponse {
  return res.withController(async () => {
    const rl = await rateLimit(getIp(request), RATE_LIMITS.read)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const tags = await tagService.getAllTags()

    const response = res.ok({ tags })
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=60'
    )
    return response
  })
}
