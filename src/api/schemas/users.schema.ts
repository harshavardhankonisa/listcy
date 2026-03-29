import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import type { Theme, Locale, Timezone } from '@/constants/user'

export const userProfile = pgTable(
  'user_profile',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    displayName: text('display_name'),
    bio: text('bio'),
    phone: text('phone'),
    dateOfBirth: timestamp('date_of_birth'),
    timezone: text('timezone').$type<Timezone>(),
    locale: text('locale').$type<Locale>(),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('userProfile_userId_idx').on(table.userId)]
)

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}))

export const userSettings = pgTable(
  'user_settings',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    theme: text('theme').$type<Theme>().default('system').notNull(),
    locale: text('locale').$type<Locale>().default('en').notNull(),
    timezone: text('timezone').$type<Timezone>().default('UTC').notNull(),
    emailNotifications: boolean('email_notifications').default(true).notNull(),
    pushNotifications: boolean('push_notifications').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('userSettings_userId_idx').on(table.userId)]
)

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(user, {
    fields: [userSettings.userId],
    references: [user.id],
  }),
}))
