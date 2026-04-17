import 'server-only'

import { z } from 'zod'
import { requireSession } from '@/api/middlewares/auth.middleware'
import { rateLimit, RATE_LIMITS } from '@/api/middlewares/ratelimit.middleware'
import * as collectionService from '@/api/services/collection.service'
import {
  createCollectionSchema,
  updateCollectionSchema,
  addListToCollectionSchema,
  removeListFromCollectionSchema,
} from '@/api/validators/collection.validator'
import * as res from '@/api/utils/response'
import { parsePagination } from '@/api/utils/pagination'
import type { ApiResponse } from '@/api/types'

// ── Collections ───────────────────────────────────────────────────────────────

export async function getCollections(request: Request): ApiResponse {
  // withController: catches unhandled service/DB throws and returns a typed
  // JSON 500. Without it, any service throw produces a raw HTML crash page
  // that API clients cannot parse. See response.ts for the full rationale.
  return res.withController(async () => {
    const url = new URL(request.url)

    if (url.searchParams.get('public') === 'true') {
      const { limit, offset } = parsePagination(url)
      const collections = await collectionService.getPublicCollections(
        limit,
        offset
      )
      return res.ok({ collections })
    }

    const { session, error } = await requireSession()
    if (error) return error

    const collections = await collectionService.getCollectionsByUserId(
      session.user.id
    )
    return res.ok({ collections })
  })
}

export async function createCollection(request: Request): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = createCollectionSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const collection = await collectionService.createCollection(
      session.user.id,
      parsed.data
    )
    return res.created({ collection })
  })
}

export async function getCollection(
  _request: Request,
  id: string
): ApiResponse {
  return res.withController(async () => {
    let requesterId: string | null = null
    try {
      const { session } = await requireSession()
      requesterId = session?.user?.id ?? null
    } catch (err) {
      // Session check threw unexpectedly (e.g. auth DB unreachable).
      // Proceed as unauthenticated — public collections remain accessible
      // even when auth is degraded. Logged for observability.
      console.error(
        '[API] Optional session check failed in getCollection:',
        err
      )
    }

    const collection = await collectionService.getCollectionById(
      id,
      requesterId
    )
    if (!collection) return res.notFound('Collection not found')
    return res.ok({ collection })
  })
}

export async function updateCollection(
  request: Request,
  id: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = updateCollectionSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const collection = await collectionService.updateCollection(
      id,
      session.user.id,
      parsed.data
    )
    // No prior existence check — null could be "missing" or "not owned".
    // 404 is used to avoid confirming whether the id exists to this caller.
    if (!collection) return res.notFound('Collection not found')
    return res.ok({ collection })
  })
}

export async function deleteCollection(
  _request: Request,
  id: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const deleted = await collectionService.deleteCollection(
      id,
      session.user.id
    )
    // Same reasoning as updateCollection — ambiguous null, use 404.
    if (!deleted) return res.notFound('Collection not found')
    return res.ok({ success: true })
  })
}

// ── Collection → Lists ────────────────────────────────────────────────────────

export async function addListToCollection(
  request: Request,
  id: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = addListToCollectionSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const result = await collectionService.addListToCollection(
      id,
      session.user.id,
      parsed.data.listId,
      parsed.data.position
    )
    if (!result) return res.notFound('Collection or list not found')
    return res.created({ result })
  })
}

export async function removeListFromCollection(
  request: Request,
  id: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = removeListFromCollectionSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const result = await collectionService.removeListFromCollection(
      id,
      session.user.id,
      parsed.data.listId
    )
    if (!result) return res.notFound('Collection or list not found')
    return res.ok({ success: true })
  })
}
