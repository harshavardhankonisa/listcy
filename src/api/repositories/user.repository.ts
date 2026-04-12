import { eq } from 'drizzle-orm'
import { db } from '@/api/config/db'
import { user } from '@/api/schemas/auth.schema'
import { userProfile, userSettings } from '@/api/schemas/users.schema'
import type { Theme, Locale, Timezone } from '@/constants/user'

export async function findUserById(userId: string) {
  const rows = await db.select().from(user).where(eq(user.id, userId)).limit(1)
  return rows[0] ?? null
}

export async function findProfileByUserId(userId: string) {
  const rows = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1)
  return rows[0] ?? null
}

export async function findProfileByUsername(username: string) {
  const rows = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.username, username))
    .limit(1)
  return rows[0] ?? null
}

export async function usernameExists(username: string) {
  const rows = await db
    .select({ username: userProfile.username })
    .from(userProfile)
    .where(eq(userProfile.username, username))
    .limit(1)
  return rows.length > 0
}

export async function createProfile(
  userId: string,
  data: { displayName?: string | null; username?: string | null }
) {
  const id = crypto.randomUUID()
  const rows = await db
    .insert(userProfile)
    .values({
      id,
      userId,
      displayName: data.displayName ?? null,
      username: data.username ?? null,
    })
    .returning()
  return rows[0]
}

export async function updateProfile(
  userId: string,
  data: Partial<{
    username: string | null
    displayName: string | null
    bio: string | null
    phone: string | null
    timezone: Timezone | null
    locale: Locale | null
    avatarUrl: string | null
  }>
) {
  const rows = await db
    .update(userProfile)
    .set(data)
    .where(eq(userProfile.userId, userId))
    .returning()
  return rows[0] ?? null
}

export async function findSettingsByUserId(userId: string) {
  const rows = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)
  return rows[0] ?? null
}

export async function createSettings(userId: string) {
  const id = crypto.randomUUID()
  const rows = await db.insert(userSettings).values({ id, userId }).returning()
  return rows[0]
}

export async function updateSettings(
  userId: string,
  data: Partial<{
    theme: Theme
    locale: Locale
    timezone: Timezone
    emailNotifications: boolean
    pushNotifications: boolean
  }>
) {
  const rows = await db
    .update(userSettings)
    .set(data)
    .where(eq(userSettings.userId, userId))
    .returning()
  return rows[0] ?? null
}
