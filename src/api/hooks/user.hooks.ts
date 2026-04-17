import 'server-only'

import type { BetterAuthOptions } from 'better-auth'
import { bootstrapUserData } from '@/api/services/user.service'

export const userHooks: NonNullable<
  BetterAuthOptions['databaseHooks']
>['user'] = {
  create: {
    after: async (user) => {
      try {
        await bootstrapUserData(user.id, user.name ?? null, user.email)
      } catch (err) {
        console.error('[Hook] bootstrapUserData failed for user', user.id, err)
        throw err
      }
    },
  },
}
