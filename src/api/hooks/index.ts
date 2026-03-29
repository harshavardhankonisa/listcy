import type { BetterAuthOptions } from 'better-auth'
import { userHooks } from './user.hooks'

/**
 * Aggregated database hooks for Better Auth.
 * Add new entity hooks here as the app grows.
 */
export const databaseHooks: BetterAuthOptions['databaseHooks'] = {
  user: userHooks,
  // list: listHooks
}
