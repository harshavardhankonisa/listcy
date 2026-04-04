import type { BetterAuthOptions } from 'better-auth'
import { bootstrapUserData } from '@/api/services/user.service'

/**
 * Database lifecycle hooks for the user entity.
 */
export const userHooks: NonNullable<
  BetterAuthOptions['databaseHooks']
>['user'] = {
  create: {
    after: async (user) => {
      await bootstrapUserData(user.id, user.name, user.email)
    },
  },
}
