import 'server-only'

import { eq, desc, and, count, ne, inArray, notInArray, sql } from 'drizzle-orm'
import { db } from '@/api/config/db'
import { list } from '@/api/schemas/lists.schema'
import { listToTag } from '@/api/schemas/tags.schema'
import { userProfile } from '@/api/schemas/users.schema'
import type { Visibility, ListType, ListItemContent } from '@/common/enums/list'

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

const itemCountExpr = sql<number>`jsonb_array_length(${list.content})`

const gridCols = {
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
  itemCount: itemCountExpr,
  authorUsername: userProfile.username,
  authorDisplayName: userProfile.displayName,
  authorAvatarUrl: userProfile.avatarUrl,
}

export async function findByUserIdPaginated(
  userId: string,
  limit: number,
  offset: number
) {
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
      itemCount: itemCountExpr,
    })
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

export async function countTotalItemsByUserId(userId: string) {
  const rows = await db
    .select({
      total: sql<number>`COALESCE(SUM(jsonb_array_length(${list.content})), 0)`,
    })
    .from(list)
    .where(eq(list.userId, userId))
  return rows[0]?.total ?? 0
}

export async function findPublic(limit = 20, offset = 0) {
  return db
    .select(gridCols)
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
      itemCount: itemCountExpr,
    })
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
  content?: ListItemContent[]
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
    slug: string
    description: string | null
    coverImage: string | null
    visibility: Visibility
    type: ListType
    content: ListItemContent[]
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

export async function findRelated(
  listId: string,
  type: ListType,
  tagIds: string[],
  limit = 6
) {
  if (tagIds.length > 0) {
    const byTags = await db
      .selectDistinct(gridCols)
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

    const existingIds = [listId, ...byTags.map((l) => l.id)]
    const byType = await db
      .select(gridCols)
      .from(list)
      .leftJoin(userProfile, eq(list.userId, userProfile.userId))
      .where(
        and(
          eq(list.visibility, 'public'),
          eq(list.type, type),
          notInArray(list.id, existingIds)
        )
      )
      .orderBy(desc(list.createdAt))
      .limit(limit - byTags.length)

    return [...byTags, ...byType]
  }

  return db
    .select(gridCols)
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
