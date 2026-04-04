import 'server-only'

import { z } from 'zod'
import { requireSession } from '@/api/middlewares/auth.middleware'
import { rateLimit, RATE_LIMITS } from '@/api/middlewares/ratelimit.middleware'
import * as listService from '@/api/services/list.service'
import {
  createListSchema,
  updateListSchema,
  createItemSchema,
} from '@/api/validators/list.validator'
import * as res from '@/api/utils/response'
import { parsePagination } from '@/api/utils/pagination'

// ── Lists ─────────────────────────────────────────────────────────────────────

export async function getLists(request: Request) {
  const url = new URL(request.url)

  if (url.searchParams.get('public') === 'true') {
    const { limit, offset } = parsePagination(url)
    const lists = await listService.getPublicLists(limit, offset)
    return res.ok({ lists })
  }

  const { session, error } = await requireSession()
  if (error) return error

  const lists = await listService.getListsByUserId(session.user.id)
  return res.ok({ lists })
}

export async function createList(request: Request) {
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
}

export async function getList(_request: Request, id: string) {
  let requesterId: string | null = null
  try {
    const { session } = await requireSession()
    requesterId = session?.user?.id ?? null
  } catch {}

  const list = await listService.getListById(id, requesterId)
  if (!list) return res.notFound('List not found')
  return res.ok({ list })
}

export async function updateList(request: Request, id: string) {
  const { session, error } = await requireSession()
  if (error) return error

  const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
  if (!rl.allowed) return res.tooManyRequests(rl)

  const body = await res.parseBody(request)
  if (!body.ok) return body.response

  const parsed = updateListSchema.safeParse(body.data)
  if (!parsed.success)
    return res.badRequest('Validation failed', z.flattenError(parsed.error))

  const list = await listService.updateList(id, session.user.id, parsed.data)
  if (!list) return res.notFound('List not found or not owned')
  return res.ok({ list })
}

export async function deleteList(_request: Request, id: string) {
  const { session, error } = await requireSession()
  if (error) return error

  const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
  if (!rl.allowed) return res.tooManyRequests(rl)

  const deleted = await listService.deleteList(id, session.user.id)
  if (!deleted) return res.notFound('List not found or not owned')
  return res.ok({ success: true })
}

// ── Items ─────────────────────────────────────────────────────────────────────

export async function addItem(request: Request, listId: string) {
  const { session, error } = await requireSession()
  if (error) return error

  const rl = await rateLimit(session.user.id, RATE_LIMITS.write)
  if (!rl.allowed) return res.tooManyRequests(rl)

  const body = await res.parseBody(request)
  if (!body.ok) return body.response

  const parsed = createItemSchema.safeParse(body.data)
  if (!parsed.success)
    return res.badRequest('Validation failed', z.flattenError(parsed.error))

  const item = await listService.addItem(listId, session.user.id, parsed.data)
  if (!item) return res.notFound('List not found or not owned')
  return res.created({ item })
}
