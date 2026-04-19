import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core'
import { list } from './lists.schema'
import { collection } from './collections.schema'

export const tag = pgTable('tag', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tagRelations = relations(tag, ({ many }) => ({
  lists: many(listToTag),
  collections: many(collectionToTag),
}))

export const listToTag = pgTable(
  'list_to_tag',
  {
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.listId, table.tagId] }),
    index('listToTag_listId_idx').on(table.listId),
    index('listToTag_tagId_idx').on(table.tagId),
  ]
)

export const listToTagRelations = relations(listToTag, ({ one }) => ({
  list: one(list, {
    fields: [listToTag.listId],
    references: [list.id],
  }),
  tag: one(tag, {
    fields: [listToTag.tagId],
    references: [tag.id],
  }),
}))

export const collectionToTag = pgTable(
  'collection_to_tag',
  {
    collectionId: text('collection_id')
      .notNull()
      .references(() => collection.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.tagId] }),
    index('collectionToTag_collectionId_idx').on(table.collectionId),
    index('collectionToTag_tagId_idx').on(table.tagId),
  ]
)

export const collectionToTagRelations = relations(
  collectionToTag,
  ({ one }) => ({
    collection: one(collection, {
      fields: [collectionToTag.collectionId],
      references: [collection.id],
    }),
    tag: one(tag, {
      fields: [collectionToTag.tagId],
      references: [tag.id],
    }),
  })
)
