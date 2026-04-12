import * as userRepo from '@/api/repositories/user.repository'
import * as listRepo from '@/api/repositories/list.repository'
import * as collectionRepo from '@/api/repositories/collection.repository'
import { generateUniqueSlug, usernameFromEmail } from '@/api/utils/slug'
import type { Theme, Locale, Timezone } from '@/constants/user'

// ── Profile ─────────────────────────────────────────────────────────────

/**
 * If the profile has no username, auto-generate one from the user's email
 * or name, persist it, and return the updated profile.
 */
async function ensureUsername(
  profile: NonNullable<Awaited<ReturnType<typeof userRepo.findProfileByUserId>>>
) {
  if (profile.username) return profile

  // Look up the auth user to get email / name for slug generation
  const authUser = await userRepo.findUserById(profile.userId)
  const base = authUser?.email
    ? usernameFromEmail(authUser.email)
    : (authUser?.name ?? 'user')
  const username = await generateUniqueSlug(base, userRepo.usernameExists)

  await userRepo.updateProfile(profile.userId, { username })
  return { ...profile, username }
}

export async function getProfile(userId: string) {
  const profile = await userRepo.findProfileByUserId(userId)
  if (!profile) return null
  return ensureUsername(profile)
}

export async function getPublicProfile(username: string) {
  return userRepo.findProfileByUsername(username)
}

export async function getPublicStats(userId: string) {
  const [listCount, collectionCount] = await Promise.all([
    listRepo.countPublicByUserId(userId),
    collectionRepo.countPublicByUserId(userId),
  ])
  return { listCount, collectionCount }
}

export async function upsertProfile(
  userId: string,
  data: {
    username?: string | null
    displayName?: string | null
    bio?: string | null
    phone?: string | null
    timezone?: Timezone | null
    locale?: Locale | null
    avatarUrl?: string | null
  }
) {
  const existing = await userRepo.findProfileByUserId(userId)
  if (existing) {
    return userRepo.updateProfile(userId, data)
  }
  return userRepo.createProfile(userId, {
    displayName: data.displayName,
    username: data.username,
  })
}

// ── Settings ────────────────────────────────────────────────────────────

export async function getSettings(userId: string) {
  return userRepo.findSettingsByUserId(userId)
}

export async function upsertSettings(
  userId: string,
  data: {
    theme?: Theme
    locale?: Locale
    timezone?: Timezone
    emailNotifications?: boolean
    pushNotifications?: boolean
  }
) {
  const existing = await userRepo.findSettingsByUserId(userId)
  if (existing) {
    return userRepo.updateSettings(userId, data)
  }
  return userRepo.createSettings(userId)
}

// ── Bootstrap ───────────────────────────────────────────────────────────

export async function bootstrapUserData(
  userId: string,
  name?: string | null,
  email?: string | null
) {
  const base = email ? usernameFromEmail(email) : (name ?? 'user')
  const username = await generateUniqueSlug(base, userRepo.usernameExists)

  await Promise.all([
    userRepo.createProfile(userId, { displayName: name ?? null, username }),
    userRepo.createSettings(userId),
  ])
}
