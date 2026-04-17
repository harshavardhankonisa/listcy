import 'server-only'

import { z } from 'zod'
import { VISIBILITIES, LIST_TYPES } from '@/constants/list'
import type { Visibility, ListType } from '@/constants/list'
import { titleSchema, descriptionSchema, urlSchema, tagsSchema } from './text'

// Spread removes readonly so z.enum() receives a mutable non-empty tuple;
// the cast preserves the exact literal union as the output type.
// Derived from constants so adding a new visibility or type only requires
// a single change in src/constants/list.ts — validators stay in sync automatically.
const visibilitySchema = z.enum([...VISIBILITIES] as [
  Visibility,
  ...Visibility[],
])
const listTypeSchema = z.enum([...LIST_TYPES] as [ListType, ...ListType[]])

export const createListSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  coverImage: urlSchema,
  visibility: visibilitySchema.default('public'),
  type: listTypeSchema.default('general'),
  tags: tagsSchema,
})

export const updateListSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema,
    coverImage: urlSchema,
    visibility: visibilitySchema.optional(),
    type: listTypeSchema.optional(),
    tags: tagsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const createItemSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  url: urlSchema,
  imageUrl: urlSchema,
  position: z.number().int().min(0).default(0),
})

export const updateItemSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema,
    url: urlSchema,
    imageUrl: urlSchema,
    position: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export type CreateListInput = z.infer<typeof createListSchema>
export type UpdateListInput = z.infer<typeof updateListSchema>
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
