import { eq, inArray } from 'drizzle-orm'
import { db } from '@/api/config/db'
import { tag } from '@/api/schemas/tags.schema'

export async function findAll() {
  return db.select().from(tag).orderBy(tag.name)
}

export async function findById(id: string) {
  const rows = await db.select().from(tag).where(eq(tag.id, id)).limit(1)
  return rows[0] ?? null
}

export async function findBySlug(slug: string) {
  const rows = await db.select().from(tag).where(eq(tag.slug, slug)).limit(1)
  return rows[0] ?? null
}

export async function findByIds(ids: string[]) {
  if (ids.length === 0) return []
  return db.select().from(tag).where(inArray(tag.id, ids))
}

export async function create(data: { name: string; slug: string }) {
  const id = crypto.randomUUID()
  const rows = await db
    .insert(tag)
    .values({ id, ...data })
    .returning()
  return rows[0]
}

export async function findOrCreate(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const existing = await findBySlug(slug)
  if (existing) return existing

  return create({ name, slug })
}

export async function remove(id: string) {
  const rows = await db.delete(tag).where(eq(tag.id, id)).returning()
  return rows[0] ?? null
}
