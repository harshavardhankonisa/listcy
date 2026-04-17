import 'server-only'

import { z } from 'zod'
import { requireSession } from '@/api/middlewares/auth.middleware'
import { rateLimit, RATE_LIMITS } from '@/api/middlewares/ratelimit.middleware'
import * as listService from '@/api/services/list.service'
import {
  createListSchema,
  updateListSchema,
  createItemSchema,
  updateItemSchema,
} from '@/api/validators/list.validator'
import * as res from '@/api/utils/response'
import { parsePagination } from '@/api/utils/pagination'
import type { ApiResponse } from '@/api/types'

// ── Lists ─────────────────────────────────────────────────────────────────────

export async function getLists(request: Request): ApiResponse {
  // withController: catches any unhandled service/DB throws and returns a
  // typed JSON 500 instead of a raw HTML crash page. See response.ts.
  return res.withController(async () => {
    const url = new URL(request.url)

    if (url.searchParams.get('public') === 'true') {
      const { limit, offset } = parsePagination(url)
      const lists = await listService.getPublicLists(limit, offset)
      return res.ok({ lists })
    }

    const { session, error } = await requireSession()
    if (error) return error

    const { limit, offset } = parsePagination(new URL(request.url))
    const data = await listService.getListsByUserIdPaginated(
      session.user.id,
      limit,
      offset
    )
    return res.ok(data)
  })
}

export async function createList(request: Request): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = createListSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const list = await listService.createList(session.user.id, parsed.data)
    return res.created({ list })
  })
}

export async function getListBySlug(
  _request: Request,
  slug: string
): ApiResponse {
  return res.withController(async () => {
    let requesterId: string | null = null
    try {
      const { session } = await requireSession()
      requesterId = session?.user?.id ?? null
    } catch (err) {
      // Session check threw unexpectedly (e.g. auth DB unreachable).
      // We intentionally proceed as unauthenticated rather than blocking the
      // request: public lists must remain accessible even if auth is degraded.
      // The error is logged so it surfaces in observability tooling.
      console.error(
        '[API] Optional session check failed in getListBySlug:',
        err
      )
    }

    const list = await listService.getListBySlug(slug, requesterId)
    if (!list) return res.notFound('List not found')
    return res.ok({ list })
  })
}

export async function updateListBySlug(
  request: Request,
  slug: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const found = await listService.getListBySlug(slug, session.user.id)
    if (!found) return res.notFound('List not found')

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = updateListSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const list = await listService.updateList(
      found.id,
      session.user.id,
      parsed.data
    )
    // The list existed above (404 already excluded) so null here means the
    // caller does not own it — 403 Forbidden, not 404, so clients can
    // distinguish "resource missing" from "resource exists but not yours".
    if (!list) return res.forbidden()
    return res.ok({ list })
  })
}

export async function deleteListBySlug(
  _request: Request,
  slug: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const found = await listService.getListBySlug(slug, session.user.id)
    if (!found) return res.notFound('List not found')

    const deleted = await listService.deleteList(found.id, session.user.id)
    // Same reasoning as updateListBySlug: existence confirmed above, so
    // null from deleteList is an ownership failure, not a missing resource.
    if (!deleted) return res.forbidden()
    return res.ok({ success: true })
  })
}

// ── Items ─────────────────────────────────────────────────────────────────────

export async function addItemBySlug(
  request: Request,
  slug: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const found = await listService.getListBySlug(slug, session.user.id)
    if (!found) return res.notFound('List not found')

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = createItemSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const item = await listService.addItem(
      found.id,
      session.user.id,
      parsed.data
    )
    // List confirmed to exist above; null from addItem means ownership check
    // inside the service failed (race condition or wrong owner).
    if (!item) return res.forbidden()
    return res.created({ item })
  })
}

export async function updateItem(
  request: Request,
  itemId: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const body = await res.parseBody(request)
    if (!body.ok) return body.response

    const parsed = updateItemSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const item = await listService.updateItem(
      itemId,
      session.user.id,
      parsed.data
    )
    // No prior existence check here — null could be "item missing" or "not
    // owned"; 404 is safer to avoid confirming whether the id exists.
    if (!item) return res.notFound('Item not found')
    return res.ok({ item })
  })
}

export async function deleteItem(
  _request: Request,
  itemId: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const deleted = await listService.deleteItem(itemId, session.user.id)
    // Same as updateItem — no prior existence check so 404 is correct.
    if (!deleted) return res.notFound('Item not found')
    return res.ok({ success: true })
  })
}
