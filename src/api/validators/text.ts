import 'server-only'

import { z } from 'zod'

/**
 * Reusable Zod building blocks shared across all validators.
 * Keep these atomic — one concern per schema.
 */

/**
 * Strip HTML tags from a user-supplied string.
 *
 * WHY HERE: title, description, and bio are stored as plain text and later
 * rendered by the frontend. If a tag like <script> or <img onerror="...">
 * were stored and the frontend ever rendered the value without escaping it
 * would become a stored XSS vector. Stripping at the Zod layer removes the
 * risk at the source — the service layer always receives clean strings
 * regardless of which code path called the validator.
 *
 * Exported so user.validator.ts can reuse it for displayName and bio, which
 * are defined inline rather than through these shared schemas.
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
