import 'server-only'

import { z } from 'zod'

/**
 * Strip HTML tags from a user-supplied string.
 */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

/** Non-empty string, whitespace trimmed, HTML stripped */
export const titleSchema = z
  .string()
  .min(1, 'Required')
  .max(200)
  .trim()
  .transform(stripHtml)

/** Long text, optional, nullable, HTML stripped */
export const descriptionSchema = z
  .string()
  .max(2000)
  .trim()
  .transform(stripHtml)
  .nullish()

/** Absolute URL, optional, nullable */
export const urlSchema = z.url().nullish()

/** Tag name — lowercase alphanumeric + hyphens, max 50 chars */
export const tagNameSchema = z.string().min(1).max(50).trim().toLowerCase()

/** Array of tag names, max 20 tags */
export const tagsSchema = z.array(tagNameSchema).max(20).default([])
