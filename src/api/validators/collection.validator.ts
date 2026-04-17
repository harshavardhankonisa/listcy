import 'server-only'

import { z } from 'zod'
import { VISIBILITIES } from '@/common/constants/list'
import type { Visibility } from '@/common/constants/list'
import { titleSchema, descriptionSchema, urlSchema, tagsSchema } from './text'

const visibilitySchema = z.enum([...VISIBILITIES] as [
  Visibility,
  ...Visibility[],
])

export const createCollectionSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  coverImage: urlSchema,
  visibility: visibilitySchema.default('public'),
  tags: tagsSchema,
})

export const updateCollectionSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema,
    coverImage: urlSchema,
    visibility: visibilitySchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const addListToCollectionSchema = z.object({
  listId: z.string().min(1, 'listId is required'),
  position: z.number().int().min(0).default(0),
})

export const removeListFromCollectionSchema = z.object({
  listId: z.string().min(1, 'listId is required'),
})

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>
export type AddListToCollectionInput = z.infer<typeof addListToCollectionSchema>
