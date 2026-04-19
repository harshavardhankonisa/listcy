import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { list } from './lists.schema'
import { collectionToTag } from './tags.schema'
import type { Visibility } from '@/common/enums/list'

export const collection = pgTable(
  'collection',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    coverImage: text('cover_image'),
    visibility: text('visibility')
      .$type<Visibility>()
      .default('public')
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('collection_userId_idx').on(table.userId),
    index('collection_visibility_idx').on(table.visibility),
  ]
)

export const collectionRelations = relations(collection, ({ one, many }) => ({
  owner: one(user, {
    fields: [collection.userId],
    references: [user.id],
  }),
  lists: many(collectionToList),
  tags: many(collectionToTag),
}))

export const collectionToList = pgTable(
  'collection_to_list',
  {
    collectionId: text('collection_id')
      .notNull()
      .references(() => collection.id, { onDelete: 'cascade' }),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.listId] }),
    index('collectionToList_collectionId_idx').on(table.collectionId),
    index('collectionToList_listId_idx').on(table.listId),
  ]
)

export const collectionToListRelations = relations(
  collectionToList,
  ({ one }) => ({
    collection: one(collection, {
      fields: [collectionToList.collectionId],
      references: [collection.id],
    }),
    list: one(list, {
      fields: [collectionToList.listId],
      references: [list.id],
    }),
  })
)
