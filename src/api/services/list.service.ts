import * as listRepo from '@/api/repositories/list.repository'
import * as tagRepo from '@/api/repositories/tag.repository'
import { generateUniqueSlug } from '@/api/utils/slug'
import type { Visibility, ListType } from '@/constants/list'

// ── Lookups ─────────────────────────────────────────────────────────────

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

  const [items, tagRows] = await Promise.all([
    listRepo.findItemsByListId(found.id),
    listRepo.findTagsByListId(found.id),
  ])
  const tags =
    tagRows.length > 0
      ? await tagRepo.findByIds(tagRows.map((r) => r.tagId))
      : []

  return { ...found, items, tags }
}

export async function getDashboardStats(userId: string) {
  const [totalLists, totalItems, publicLists] = await Promise.all([
    listRepo.countByUserId(userId),
    listRepo.countItemsByUserId(userId),
    listRepo.countPublicByUserId(userId),
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
  const ids = lists.map((l) => l.id)
  const itemCounts = await listRepo.itemCountsByListIds(ids)
  return {
    lists: lists.map((l) => ({ ...l, itemCount: itemCounts[l.id] ?? 0 })),
    total,
  }
}

export async function getPublicLists(limit = 20, offset = 0) {
  const lists = await listRepo.findPublic(limit, offset)
  const ids = lists.map((l) => l.id)
  const itemCounts = await listRepo.itemCountsByListIds(ids)
  return lists.map((l) => ({ ...l, itemCount: itemCounts[l.id] ?? 0 }))
}

export async function getPublicListsByUserId(
  userId: string,
  limit = 20,
  offset = 0
) {
  const lists = await listRepo.findPublicByUserId(userId, limit, offset)
  const ids = lists.map((l) => l.id)
  const itemCounts = await listRepo.itemCountsByListIds(ids)
  return lists.map((l) => ({ ...l, itemCount: itemCounts[l.id] ?? 0 }))
}

// ── Create / Update / Delete ────────────────────────────────────────────

export async function createList(
  userId: string,
  data: {
    title: string
    description?: string | null
    coverImage?: string | null
    visibility?: Visibility
    type?: ListType
    tags?: string[]
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
  }>
) {
  const { tags: tagNames, ...fields } = data

  // If title changed, regenerate slug
  const updateData: Record<string, unknown> = { ...fields }
  if (fields.title) {
    updateData.slug = await generateUniqueSlug(fields.title, async (s) => {
      const existing = await listRepo.findBySlug(s)
      // Allow the same slug if it belongs to this list
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

  return listRepo.addItem({ listId, ...data })
}

export async function updateItem(
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
  const item = await listRepo.findItemById(itemId)
  if (!item) return null

  const parentList = await listRepo.findById(item.listId)
  if (!parentList || parentList.userId !== userId) return null

  return listRepo.updateItem(itemId, data)
}

export async function deleteItem(itemId: string, userId: string) {
  const item = await listRepo.findItemById(itemId)
  if (!item) return null

  const parentList = await listRepo.findById(item.listId)
  if (!parentList || parentList.userId !== userId) return null

  return listRepo.removeItem(itemId)
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

// ── Related Lists ───────────────────────────────────────────────────────

export async function getRelatedLists(
  listId: string,
  type: ListType,
  limit = 6
) {
  // Get the list's tag IDs first
  const listTags = await listRepo.findTagsByListId(listId)
  const tagIds = listTags.map((t) => t.tagId)

  const related = await listRepo.findRelated(listId, type, tagIds, limit)

  // Enrich with item counts
  const ids = related.map((l) => l.id)
  const counts = await listRepo.itemCountsByListIds(ids)
  return related.map((l) => ({ ...l, itemCount: counts[l.id] ?? 0 }))
}
