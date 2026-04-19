export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = (typeof THEMES)[number]

export const LOCALES = ['en', 'es', 'fr', 'de', 'ja', 'pt', 'zh'] as const
export type Locale = (typeof LOCALES)[number]

export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'Pacific/Auckland',
] as const
export type Timezone = (typeof TIMEZONES)[number]
