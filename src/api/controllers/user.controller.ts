import 'server-only'

import { z } from 'zod'
import { requireSession } from '@/api/middlewares/auth.middleware'
import { rateLimit, RATE_LIMITS } from '@/api/middlewares/ratelimit.middleware'
import * as userService from '@/api/services/user.service'
import {
  updateProfileSchema,
  updateSettingsSchema,
} from '@/api/validators/user.validator'
import * as res from '@/api/utils/response'
import type { ApiResponse } from '@/api/types'

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile(): ApiResponse {
  const { session, error } = await requireSession()
  if (error) return error

  const profile = await userService.getProfile(session.user.id)
  return res.ok({ profile })
}

export async function updateProfile(request: Request): ApiResponse {
  const { session, error } = await requireSession()
  if (error) return error

  const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
  if (!rl.allowed) return res.tooManyRequests(rl)

  const body = await res.parseBody(request)
  if (!body.ok) return body.response

  const parsed = updateProfileSchema.safeParse(body.data)
  if (!parsed.success)
    return res.badRequest('Validation failed', z.flattenError(parsed.error))

  const profile = await userService.upsertProfile(session.user.id, parsed.data)
  return res.ok({ profile })
}

// ── Public Profile ────────────────────────────────────────────────────────────

export async function getPublicProfile(
  _request: Request,
  username: string
): ApiResponse {
  const profile = await userService.getPublicProfile(username)
  if (!profile) return res.notFound('User not found')
  return res.ok({ profile })
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): ApiResponse {
  const { session, error } = await requireSession()
  if (error) return error

  const settings = await userService.getSettings(session.user.id)
  return res.ok({ settings })
}

export async function updateSettings(request: Request): ApiResponse {
  const { session, error } = await requireSession()
  if (error) return error

  const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
  if (!rl.allowed) return res.tooManyRequests(rl)

  const body = await res.parseBody(request)
  if (!body.ok) return body.response

  const parsed = updateSettingsSchema.safeParse(body.data)
  if (!parsed.success)
    return res.badRequest('Validation failed', z.flattenError(parsed.error))

  const settings = await userService.upsertSettings(
    session.user.id,
    parsed.data
  )
  return res.ok({ settings })
}
