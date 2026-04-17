export const USER_SESSION_CONFIG = {
  /** Session expires after 30 days of inactivity */
  expiresIn: 60 * 60 * 24 * 30,
  /** Refresh session cookie once per day to keep active users logged in */
  updateAge: 60 * 60 * 24,
} as const

export const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
} as const
