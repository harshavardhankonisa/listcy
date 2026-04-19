import 'server-only'

import { z } from 'zod'
import {
  requireSession,
  getOptionalSession,
} from '@/api/middlewares/auth.middleware'
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

// Lists

export async function getLists(request: Request): ApiResponse {
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
    const requesterId = await getOptionalSession()

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

    if (!deleted) return res.forbidden()
    return res.ok({ success: true })
  })
}

// Items

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

    if (!item) return res.forbidden()
    return res.created({ item })
  })
}

export async function updateItem(
  request: Request,
  slug: string,
  itemId: string
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

    const parsed = updateItemSchema.safeParse(body.data)
    if (!parsed.success)
      return res.badRequest('Validation failed', z.flattenError(parsed.error))

    const item = await listService.updateItem(
      found.id,
      itemId,
      session.user.id,
      parsed.data
    )

    if (!item) return res.notFound('Item not found')
    return res.ok({ item })
  })
}

export async function deleteItem(
  _request: Request,
  slug: string,
  itemId: string
): ApiResponse {
  return res.withController(async () => {
    const { session, error } = await requireSession()
    if (error) return error

    const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
    if (!rl.allowed) return res.tooManyRequests(rl)

    const found = await listService.getListBySlug(slug, session.user.id)
    if (!found) return res.notFound('List not found')

    const deleted = await listService.deleteItem(
      found.id,
      itemId,
      session.user.id
    )

    if (!deleted) return res.notFound('Item not found')
    return res.ok({ success: true })
  })
}
