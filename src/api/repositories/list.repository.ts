import { eq, desc, and, count, sql, ne, inArray } from 'drizzle-orm'
import { db } from '@/api/config/db'
import { list, listItem } from '@/api/schemas/lists.schema'
import { listToTag } from '@/api/schemas/tags.schema'
import { userProfile } from '@/api/schemas/users.schema'
import type { Visibility, ListType } from '@/common/constants/list'

export async function findById(id: string) {
  const rows = await db.select().from(list).where(eq(list.id, id)).limit(1)
  return rows[0] ?? null
}

export async function findBySlug(slug: string) {
  const rows = await db.select().from(list).where(eq(list.slug, slug)).limit(1)
  return rows[0] ?? null
}

export async function slugExists(slug: string) {
  const rows = await db
    .select({ slug: list.slug })
    .from(list)
    .where(eq(list.slug, slug))
    .limit(1)
  return rows.length > 0
}

export async function findByUserId(userId: string) {
  return db
    .select()
    .from(list)
    .where(eq(list.userId, userId))
    .orderBy(desc(list.createdAt))
}

export async function findByUserIdPaginated(
  userId: string,
  limit: number,
  offset: number
) {
  return db
    .select()
    .from(list)
    .where(eq(list.userId, userId))
    .orderBy(desc(list.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function countByUserId(userId: string) {
  const rows = await db
    .select({ count: count() })
    .from(list)
    .where(eq(list.userId, userId))
  return rows[0]?.count ?? 0
}

export async function countPublicByUserId(userId: string) {
  const rows = await db
    .select({ count: count() })
    .from(list)
    .where(and(eq(list.userId, userId), eq(list.visibility, 'public')))
  return rows[0]?.count ?? 0
}

export async function countItemsByUserId(userId: string) {
  const rows = await db
    .select({ count: count() })
    .from(listItem)
    .innerJoin(list, eq(listItem.listId, list.id))
    .where(eq(list.userId, userId))
  return rows[0]?.count ?? 0
}

export async function findPublic(limit = 20, offset = 0) {
  return db
    .select({
      id: list.id,
      slug: list.slug,
      title: list.title,
      description: list.description,
      coverImage: list.coverImage,
      type: list.type,
      visibility: list.visibility,
      userId: list.userId,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      authorUsername: userProfile.username,
      authorDisplayName: userProfile.displayName,
      authorAvatarUrl: userProfile.avatarUrl,
    })
    .from(list)
    .leftJoin(userProfile, eq(list.userId, userProfile.userId))
    .where(eq(list.visibility, 'public'))
    .orderBy(desc(list.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function findPublicByUserId(
  userId: string,
  limit = 20,
  offset = 0
) {
  return db
    .select()
    .from(list)
    .where(and(eq(list.userId, userId), eq(list.visibility, 'public')))
    .orderBy(desc(list.createdAt))
    .limit(limit)
    .offset(offset)
}

export async function create(data: {
  userId: string
  slug: string
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

export async function itemCountsByListIds(listIds: string[]) {
  if (listIds.length === 0) return {}
  const rows = await db
    .select({
      listId: listItem.listId,
      count: count(),
    })
    .from(listItem)
    .where(sql`${listItem.listId} IN ${listIds}`)
    .groupBy(listItem.listId)
  const map: Record<string, number> = {}
  for (const r of rows) map[r.listId] = r.count
  return map
}

export async function update(
  id: string,
  userId: string,
  data: Partial<{
    title: string
    slug: string
    description: string | null
    coverImage: string | null
    visibility: Visibility
    type: ListType
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

/**
 * Find public lists related to a given list by shared tags or same type.
 * Excludes the source list itself.
 */
export async function findRelated(
  listId: string,
  type: ListType,
  tagIds: string[],
  limit = 6
) {
  // Strategy: prefer lists sharing tags, fall back to same type
  if (tagIds.length > 0) {
    const byTags = await db
      .selectDistinct({
        id: list.id,
        slug: list.slug,
        title: list.title,
        description: list.description,
        coverImage: list.coverImage,
        type: list.type,
        visibility: list.visibility,
        userId: list.userId,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
        authorUsername: userProfile.username,
        authorDisplayName: userProfile.displayName,
        authorAvatarUrl: userProfile.avatarUrl,
      })
      .from(list)
      .innerJoin(listToTag, eq(list.id, listToTag.listId))
      .leftJoin(userProfile, eq(list.userId, userProfile.userId))
      .where(
        and(
          eq(list.visibility, 'public'),
          ne(list.id, listId),
          inArray(listToTag.tagId, tagIds)
        )
      )
      .orderBy(desc(list.createdAt))
      .limit(limit)

    if (byTags.length >= limit) return byTags

    // Fill remaining slots with same-type lists
    const existingIds = [listId, ...byTags.map((l) => l.id)]
    const byType = await db
      .select({
        id: list.id,
        slug: list.slug,
        title: list.title,
        description: list.description,
        coverImage: list.coverImage,
        type: list.type,
        visibility: list.visibility,
        userId: list.userId,
        createdAt: list.createdAt,
        updatedAt: list.updatedAt,
        authorUsername: userProfile.username,
        authorDisplayName: userProfile.displayName,
        authorAvatarUrl: userProfile.avatarUrl,
      })
      .from(list)
      .leftJoin(userProfile, eq(list.userId, userProfile.userId))
      .where(
        and(
          eq(list.visibility, 'public'),
          eq(list.type, type),
          sql`${list.id} NOT IN (${sql.join(
            existingIds.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
      )
      .orderBy(desc(list.createdAt))
      .limit(limit - byTags.length)

    return [...byTags, ...byType]
  }

  // No tags — just match by type
  return db
    .select({
      id: list.id,
      slug: list.slug,
      title: list.title,
      description: list.description,
      coverImage: list.coverImage,
      type: list.type,
      visibility: list.visibility,
      userId: list.userId,
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
      authorUsername: userProfile.username,
      authorDisplayName: userProfile.displayName,
      authorAvatarUrl: userProfile.avatarUrl,
    })
    .from(list)
    .leftJoin(userProfile, eq(list.userId, userProfile.userId))
    .where(
      and(
        eq(list.visibility, 'public'),
        eq(list.type, type),
        ne(list.id, listId)
      )
    )
    .orderBy(desc(list.createdAt))
    .limit(limit)
}
