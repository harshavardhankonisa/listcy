import { eq, desc, and } from 'drizzle-orm'
import { db } from '@/api/config/db'
import { list, listItem } from '@/api/schemas/lists.schema'
import { listToTag } from '@/api/schemas/tags.schema'
import type { Visibility, ListType } from '@/constants/list'

export async function findById(id: string) {
  const rows = await db.select().from(list).where(eq(list.id, id)).limit(1)
  return rows[0] ?? null
}

export async function findByUserId(userId: string) {
  return db
    .select()
    .from(list)
    .where(eq(list.userId, userId))
    .orderBy(desc(list.createdAt))
}

export async function findPublic(limit = 20, offset = 0) {
  return db
    .select()
    .from(list)
    .where(eq(list.visibility, 'public'))
    .orderBy(desc(list.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function create(data: {
  userId: string
  title: string
  description?: string | null
  coverImage?: string | null
  visibility?: Visibility
  type?: ListType
}) {
  const id = crypto.randomUUID()
  const rows = await db
    .insert(list)
    .values({ id, ...data })
    .returning()
  return rows[0]
}

export async function update(
  id: string,
  userId: string,
  data: Partial<{
    title: string
    description: string | null
    coverImage: string | null
    visibility: Visibility
  }>
) {
  const rows = await db
    .update(list)
    .set(data)
    .where(and(eq(list.id, id), eq(list.userId, userId)))
    .returning()
  return rows[0] ?? null
}

export async function remove(id: string, userId: string) {
  const rows = await db
    .delete(list)
    .where(and(eq(list.id, id), eq(list.userId, userId)))
    .returning()
  return rows[0] ?? null
}

export async function findItemById(id: string) {
  const rows = await db
    .select()
    .from(listItem)
    .where(eq(listItem.id, id))
    .limit(1)
  return rows[0] ?? null
}

export async function findItemsByListId(listId: string) {
  return db
    .select()
    .from(listItem)
    .where(eq(listItem.listId, listId))
    .orderBy(listItem.position)
}

export async function addItem(data: {
  listId: string
  title: string
  description?: string | null
  url?: string | null
  imageUrl?: string | null
  position?: number
}) {
  const id = crypto.randomUUID()
  const rows = await db
    .insert(listItem)
    .values({ id, ...data })
    .returning()
  return rows[0]
}

export async function updateItem(
  id: string,
  data: Partial<{
    title: string
    description: string | null
    url: string | null
    imageUrl: string | null
    position: number
  }>
) {
  const rows = await db
    .update(listItem)
    .set(data)
    .where(eq(listItem.id, id))
    .returning()
  return rows[0] ?? null
}

export async function removeItem(id: string) {
  const rows = await db.delete(listItem).where(eq(listItem.id, id)).returning()
  return rows[0] ?? null
}

export async function setTags(listId: string, tagIds: string[]) {
  await db.delete(listToTag).where(eq(listToTag.listId, listId))
  if (tagIds.length === 0) return []
  return db
    .insert(listToTag)
    .values(tagIds.map((tagId) => ({ listId, tagId })))
    .returning()
}

export async function findTagsByListId(listId: string) {
  return db.select().from(listToTag).where(eq(listToTag.listId, listId))
}
