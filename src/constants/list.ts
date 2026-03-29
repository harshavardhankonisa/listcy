export const VISIBILITIES = ['public', 'unlisted', 'private'] as const
export type Visibility = (typeof VISIBILITIES)[number]
