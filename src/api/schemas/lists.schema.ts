import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, integer, index } from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { listToTag } from './tags.schema'
import { collectionToList } from './collections.schema'
import type { Visibility, ListType } from '@/constants/list'

export const list = pgTable(
  'list',
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
    type: text('type').$type<ListType>().default('general').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('list_userId_idx').on(table.userId),
    index('list_visibility_idx').on(table.visibility),
  ]
)

export const listRelations = relations(list, ({ one, many }) => ({
  owner: one(user, {
    fields: [list.userId],
    references: [user.id],
  }),
  items: many(listItem),
  tags: many(listToTag),
  collections: many(collectionToList),
}))

export const listItem = pgTable(
  'list_item',
  {
    id: text('id').primaryKey(),
    listId: text('list_id')
      .notNull()
      .references(() => list.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    url: text('url'),
    imageUrl: text('image_url'),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('listItem_listId_idx').on(table.listId)]
)

export const listItemRelations = relations(listItem, ({ one }) => ({
  list: one(list, {
    fields: [listItem.listId],
    references: [list.id],
  }),
}))
