export const VISIBILITIES = ['public', 'unlisted', 'private'] as const
export type Visibility = (typeof VISIBILITIES)[number]

export const LIST_TYPES = [
  'ranked',
  'resources',
  'checklist',
  'watchlist',
  'general',
] as const
export type ListType = (typeof LIST_TYPES)[number]
