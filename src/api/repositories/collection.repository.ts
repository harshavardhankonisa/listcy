import { eq, desc, and, count } from 'drizzle-orm'
import { db } from '@/api/config/db'
import { collection, collectionToList } from '@/api/schemas/collections.schema'
import { collectionToTag } from '@/api/schemas/tags.schema'
import type { Visibility } from '@/constants/list'

export async function findById(id: string) {
  const rows = await db
    .select()
    .from(collection)
    .where(eq(collection.id, id))
    .limit(1)
  return rows[0] ?? null
}

export async function findByUserId(userId: string) {
  return db
    .select()
    .from(collection)
    .where(eq(collection.userId, userId))
    .orderBy(desc(collection.createdAt))
}

export async function countPublicByUserId(userId: string) {
  const rows = await db
    .select({ count: count() })
    .from(collection)
    .where(
      and(eq(collection.userId, userId), eq(collection.visibility, 'public'))
    )
  return rows[0]?.count ?? 0
}

export async function findPublicByUserId(
  userId: string,
  limit = 20,
  offset = 0
) {
  return db
    .select()
    .from(collection)
    .where(
      and(eq(collection.userId, userId), eq(collection.visibility, 'public'))
    )
    .orderBy(desc(collection.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function findPublic(limit = 20, offset = 0) {
  return db
    .select()
    .from(collection)
    .where(eq(collection.visibility, 'public'))
    .orderBy(desc(collection.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function create(data: {
  userId: string
  title: string
  description?: string | null
  coverImage?: string | null
  visibility?: Visibility
}) {
  const id = crypto.randomUUID()
  const rows = await db
    .insert(collection)
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
    .update(collection)
    .set(data)
    .where(and(eq(collection.id, id), eq(collection.userId, userId)))
    .returning()
  return rows[0] ?? null
}

export async function remove(id: string, userId: string) {
  const rows = await db
    .delete(collection)
    .where(and(eq(collection.id, id), eq(collection.userId, userId)))
    .returning()
  return rows[0] ?? null
}

export async function findListsByCollectionId(collectionId: string) {
  return db
    .select()
    .from(collectionToList)
    .where(eq(collectionToList.collectionId, collectionId))
    .orderBy(collectionToList.position)
}

export async function addList(
  collectionId: string,
  listId: string,
  position = 0
) {
  const rows = await db
    .insert(collectionToList)
    .values({ collectionId, listId, position })
    .onConflictDoNothing()
    .returning()
  return rows[0] ?? null
}

export async function removeList(collectionId: string, listId: string) {
  const rows = await db
    .delete(collectionToList)
    .where(
      and(
        eq(collectionToList.collectionId, collectionId),
        eq(collectionToList.listId, listId)
      )
    )
    .returning()
  return rows[0] ?? null
}

export async function setTags(collectionId: string, tagIds: string[]) {
  await db
    .delete(collectionToTag)
    .where(eq(collectionToTag.collectionId, collectionId))
  if (tagIds.length === 0) return []
  return db
    .insert(collectionToTag)
    .values(tagIds.map((tagId) => ({ collectionId, tagId })))
    .returning()
}
