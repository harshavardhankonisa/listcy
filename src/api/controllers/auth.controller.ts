import 'server-only'

import { auth } from '@/api/config/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import {
  rateLimit,
  RATE_LIMITS,
  getIp,
} from '@/api/middlewares/ratelimit.middleware'
import * as res from '@/api/utils/response'

const { GET: authGet, POST: authPost } = toNextJsHandler(auth)

export const GET = authGet

export async function POST(request: Request) {
  const rl = await rateLimit(getIp(request), RATE_LIMITS.auth)
  if (!rl.allowed) return res.tooManyRequests(rl)

  return authPost(request)
}
