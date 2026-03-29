import * as userRepo from '@/api/repositories/user.repository'
import type { Theme, Locale, Timezone } from '@/constants/user'

/**
 * Profile
 * @param userId
 * @returns
 */
export async function getProfile(userId: string) {
  return userRepo.findProfileByUserId(userId)
}

export async function upsertProfile(
  userId: string,
  data: {
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
  return userRepo.createProfile(userId, { displayName: data.displayName })
}

/**
 * Settings
 * @param userId
 * @returns
 */
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

/**
 * Bootstrap user related details when user is created.
 * @param userId
 * @param name
 */
export async function bootstrapUserData(userId: string, name?: string | null) {
  await Promise.all([
    userRepo.createProfile(userId, { displayName: name ?? null }),
    userRepo.createSettings(userId),
  ])
}
