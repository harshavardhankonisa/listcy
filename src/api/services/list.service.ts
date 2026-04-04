import * as listRepo from '@/api/repositories/list.repository'
import * as tagRepo from '@/api/repositories/tag.repository'
import type { Visibility, ListType } from '@/constants/list'

export async function getListById(id: string, requesterId?: string | null) {
  const found = await listRepo.findById(id)
  if (!found) return null

  if (found.visibility === 'private' && found.userId !== requesterId) {
    return null
  }

  const items = await listRepo.findItemsByListId(id)
  const tagRows = await listRepo.findTagsByListId(id)
  const tags =
    tagRows.length > 0
      ? await tagRepo.findByIds(tagRows.map((r) => r.tagId))
      : []

  return { ...found, items, tags }
}

export async function getListsByUserId(userId: string) {
  return listRepo.findByUserId(userId)
}

export async function getPublicLists(limit = 20, offset = 0) {
  return listRepo.findPublic(limit, offset)
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
  }
) {
  const { tags: tagNames, ...listData } = data
  const created = await listRepo.create({ userId, ...listData })

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
  }>
) {
  return listRepo.update(id, userId, data)
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
