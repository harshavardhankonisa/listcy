import 'server-only'

import type { BetterAuthOptions } from 'better-auth'
import { userHooks } from './user.hooks'

export const databaseHooks: BetterAuthOptions['databaseHooks'] = {
  user: userHooks,
}
