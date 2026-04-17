import 'server-only'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/api/config/db'
import * as schema from '@/api/schemas'
import { databaseHooks } from '@/api/hooks'
import { USER_SESSION_CONFIG } from '@/common/constants/auth'

if (!process.env.ORIGIN) {
  console.warn(
    '[Security] Without trustedOrigins, Better Auth accepts cross-origin auth requests from any domain. Restricting to the known origin prevents cross-origin request forgery on auth flows.'
  )
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is not set')
}

const githubClientId = process.env.GITHUB_CLIENT_ID
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET

if (!(Boolean(githubClientId) && Boolean(githubClientSecret))) {
  console.warn(
    '[Auth] GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET - Without credentials GitHub OAuth is disabled.'
  )
}

const githubEnabled = Boolean(githubClientId && githubClientSecret)

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  trustedOrigins: [process.env.ORIGIN ?? 'http://localhost:3000'],
  emailAndPassword: {
    enabled: true,
    // TODO: requireEmailVerification is intentionally false
    /** until an email sending service (Resend, SES, etc.) is wired up.
     * Set to true and add a sendVerificationEmail callback when email delivery is ready. */
    requireEmailVerification: false,
  },
  session: {
    expiresIn: USER_SESSION_CONFIG.expiresIn,
    updateAge: USER_SESSION_CONFIG.updateAge,
  },
  ...(githubEnabled && {
    socialProviders: {
      github: {
        clientId: githubClientId!,
        clientSecret: githubClientSecret!,
      },
    },
  }),

  databaseHooks,
})
