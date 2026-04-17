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
  // withController: catches unhandled service/DB throws so the route always
  // returns a typed JSON 500 instead of a raw HTML crash page. See response.ts.
  return res.withController(async () => {
    // Fallback rate limit added as a defence-in-depth measure.
    // The primary protection is Cloudflare, but if a request reaches this
    // handler without passing through Cloudflare (direct-to-origin, mis-
    // configuration, or staging environments) there would be zero throttling.
    // This ensures the endpoint is protected even in those scenarios.
    // IP is used as the identifier because tags are public and there is no
    // authenticated user to key on.
    const rl = await rateLimit(getIp(request), RATE_LIMITS.read)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const tags = await tagService.getAllTags()
    return res.ok({ tags })
  })
}
