import 'server-only'

import { z } from 'zod'
import { THEMES, LOCALES, TIMEZONES } from '@/constants/user'
import type { Theme, Locale, Timezone } from '@/constants/user'
import { stripHtml } from './text'

// Spread removes readonly so z.enum() receives a mutable non-empty tuple,
// cast to the literal union preserves exact output types.
const themeSchema = z.enum([...THEMES] as [Theme, ...Theme[]])
const localeSchema = z.enum([...LOCALES] as [Locale, ...Locale[]])
const timezoneSchema = z.enum([...TIMEZONES] as [Timezone, ...Timezone[]])

export const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(
        /^[a-z0-9_-]+$/,
        'Username must be lowercase alphanumeric, hyphens, or underscores'
      )
      .nullish(),
    // stripHtml applied — see text.ts for why all user-supplied text is sanitized
    displayName: z
      .string()
      .min(1)
      .max(100)
      .trim()
      .transform(stripHtml)
      .nullish(),
    bio: z.string().max(500).trim().transform(stripHtml).nullish(),
    phone: z.string().max(30).trim().nullish(),
    timezone: timezoneSchema.nullish(),
    locale: localeSchema.nullish(),
    avatarUrl: z.url().nullish(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const updateSettingsSchema = z
  .object({
    theme: themeSchema.optional(),
    locale: localeSchema.optional(),
    timezone: timezoneSchema.optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
