import 'server-only'

import { z } from 'zod'

/**
 * Reusable Zod building blocks shared across all validators.
 * Keep these atomic — one concern per schema.
 */

/** Non-empty string, whitespace trimmed */
export const titleSchema = z.string().min(1, 'Required').max(200).trim()

/** Long text, optional, nullable */
export const descriptionSchema = z.string().max(2000).trim().nullish()

/** Absolute URL, optional, nullable */
export const urlSchema = z.url().nullish()

/** Tag name — lowercase alphanumeric + hyphens, max 50 chars */
export const tagNameSchema = z.string().min(1).max(50).trim().toLowerCase()

/** Array of tag names, max 20 tags */
export const tagsSchema = z.array(tagNameSchema).max(20).default([])
