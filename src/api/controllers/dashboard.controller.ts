import 'server-only'

import { requireSession } from '@/api/middlewares/auth.middleware'
import { rateLimit, RATE_LIMITS } from '@/api/middlewares/ratelimit.middleware'
import * as dashboardService from '@/api/services/dashboard.service'
import * as res from '@/api/utils/response'
import type { ApiResponse } from '@/api/types'

export async function getStats(): ApiResponse {
  // withController: catches unhandled service/DB throws so the route always
  // returns a typed JSON 500 instead of a raw HTML crash page. See response.ts.
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    // Rate limit added here because dashboard/stats is a protected but
    // read-heavy endpoint — a client polling it aggressively (e.g. a runaway
    // frontend loop) would hammer the DB with aggregation queries. Keying on
    // session.user.id (not IP) since the user is authenticated and we want
    // per-user fairness rather than per-IP fairness.
    const rl = await rateLimit(session.user.id, RATE_LIMITS.read)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const stats = await dashboardService.getStats(session.user.id)
    return res.ok({ stats })
  })
}
