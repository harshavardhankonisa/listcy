import 'server-only'

import * as listRepo from '@/api/repositories/list.repository'
import * as tagRepo from '@/api/repositories/tag.repository'
import { generateUniqueSlug } from '@/api/utils/slug'
import type { Visibility, ListType, ListItemContent } from '@/common/enums/list'

export async function getListById(id: string, requesterId?: string | null) {
  const found = await listRepo.findById(id)
  return found ? enrichList(found, requesterId) : null
}

export async function getListBySlug(slug: string, requesterId?: string | null) {
  const found = await listRepo.findBySlug(slug)
  return found ? enrichList(found, requesterId) : null
}

async function enrichList(
  found: Awaited<ReturnType<typeof listRepo.findById>> & object,
  requesterId?: string | null
) {
  if (found.visibility === 'private' && found.userId !== requesterId) {
    return null
  }

  const tagRows = await listRepo.findTagsByListId(found.id)
  const tags =
    tagRows.length > 0
      ? await tagRepo.findByIds(tagRows.map((r) => r.tagId))
      : []

  const items = (found.content ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)

  return { ...found, items, tags }
}

export async function getDashboardStats(userId: string) {
  const [totalLists, publicLists, totalItems] = await Promise.all([
    listRepo.countByUserId(userId),
    listRepo.countPublicByUserId(userId),
    listRepo.countTotalItemsByUserId(userId),
  ])
  return {
    totalLists,
    totalItems,
    publicLists,
    privateLists: totalLists - publicLists,
  }
}

export async function getListsByUserId(userId: string) {
  return listRepo.findByUserId(userId)
}

export async function getListsByUserIdPaginated(
  userId: string,
  limit: number,
  offset: number
) {
  const [lists, total] = await Promise.all([
    listRepo.findByUserIdPaginated(userId, limit, offset),
    listRepo.countByUserId(userId),
  ])
  return { lists, total }
}

export async function getPublicLists(limit = 20, offset = 0) {
  return listRepo.findPublic(limit, offset)
}

export async function getPublicListsByUserId(
  userId: string,
  limit = 20,
  offset = 0
) {
  return listRepo.findPublicByUserId(userId, limit, offset)
}

export async function createList(
  userId: string,
  data: {
    title: string
    description?: string | null
    coverImage?: string | null
    visibility?: Visibility
    type?: ListType
    tags?: string[]
    content?: ListItemContent[]
  }
) {
  const { tags: tagNames, ...listData } = data
  const slug = await generateUniqueSlug(data.title, listRepo.slugExists)
  const created = await listRepo.create({ userId, slug, ...listData })

  if (tagNames && tagNames.length > 0) {
    const resolvedTags = await Promise.all(
      tagNames.map((n) => tagRepo.findOrCreate(n))
    )
    await listRepo.setTags(
      created.id,
      resolvedTags.map((t) => t.id)
    )
  }

  return created
}

export async function updateList(
  id: string,
  userId: string,
  data: Partial<{
    title: string
    description: string | null
    coverImage: string | null
    visibility: Visibility
    type: ListType
    tags: string[]
    content: ListItemContent[]
  }>
) {
  const { tags: tagNames, ...fields } = data

  const updateData: Record<string, unknown> = { ...fields }
  if (fields.title) {
    updateData.slug = await generateUniqueSlug(fields.title, async (s) => {
      const existing = await listRepo.findBySlug(s)
      return existing !== null && existing.id !== id
    })
  }

  const updated = await listRepo.update(
    id,
    userId,
    updateData as Parameters<typeof listRepo.update>[2]
  )

  if (updated && tagNames !== undefined) {
    const resolvedTags =
      tagNames.length > 0
        ? await Promise.all(tagNames.map((n) => tagRepo.findOrCreate(n)))
        : []
    await listRepo.setTags(
      updated.id,
      resolvedTags.map((t) => t.id)
    )
  }

  return updated
}

export async function deleteList(id: string, userId: string) {
  return listRepo.remove(id, userId)
}

const MAX_ITEMS_PER_LIST = 500

export async function addItem(
  listId: string,
  userId: string,
  data: {
    title: string
    description?: string | null
    url?: string | null
    imageUrl?: string | null
    position?: number
  }
) {
  const found = await listRepo.findById(listId)
  if (!found || found.userId !== userId) return null

  const existing = found.content ?? []
  if (existing.length >= MAX_ITEMS_PER_LIST) return null

  const newItem: ListItemContent = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description ?? null,
    url: data.url ?? null,
    imageUrl: data.imageUrl ?? null,
    position: data.position ?? existing.length,
  }

  return listRepo.update(listId, userId, {
    content: [...existing, newItem],
  })
}

export async function updateItem(
  listId: string,
  itemId: string,
  userId: string,
  data: Partial<{
    title: string
    description: string | null
    url: string | null
    imageUrl: string | null
    position: number
  }>
) {
  const found = await listRepo.findById(listId)
  if (!found || found.userId !== userId) return null

  const content = found.content ?? []
  const idx = content.findIndex((i) => i.id === itemId)
  if (idx === -1) return null

  const updated = content.map((item, i) =>
    i === idx ? { ...item, ...data } : item
  )

  return listRepo.update(listId, userId, { content: updated })
}

export async function deleteItem(
  listId: string,
  itemId: string,
  userId: string
) {
  const found = await listRepo.findById(listId)
  if (!found || found.userId !== userId) return null

  const content = (found.content ?? []).filter((i) => i.id !== itemId)
  return listRepo.update(listId, userId, { content })
}

export async function setListTags(
  listId: string,
  userId: string,
  tagNames: string[]
) {
  const found = await listRepo.findById(listId)
  if (!found || found.userId !== userId) return null

  const resolvedTags = await Promise.all(
    tagNames.map((n) => tagRepo.findOrCreate(n))
  )
  return listRepo.setTags(
    listId,
    resolvedTags.map((t) => t.id)
  )
}

export async function getRelatedLists(
  listId: string,
  type: ListType,
  limit = 6
) {
  const listTags = await listRepo.findTagsByListId(listId)
  const tagIds = listTags.map((t) => t.tagId)
  return listRepo.findRelated(listId, type, tagIds, limit)
}
