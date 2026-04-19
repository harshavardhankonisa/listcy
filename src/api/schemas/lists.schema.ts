import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { listToTag } from './tags.schema'
import { collectionToList } from './collections.schema'
import type { Visibility, ListType, ListItemContent } from '@/common/enums/list'

export const list = pgTable(
  'list',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    coverImage: text('cover_image'),
    visibility: text('visibility')
      .$type<Visibility>()
      .default('public')
      .notNull(),
    type: text('type').$type<ListType>().default('general').notNull(),
    content: jsonb('content').$type<ListItemContent[]>().default([]).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('list_userId_idx').on(table.userId),
    index('list_visibility_idx').on(table.visibility),
    uniqueIndex('list_slug_idx').on(table.slug),
  ]
)

export const listRelations = relations(list, ({ one, many }) => ({
  owner: one(user, {
    fields: [list.userId],
    references: [user.id],
  }),
  tags: many(listToTag),
  collections: many(collectionToList),
}))
