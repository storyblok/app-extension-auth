// As in https://github.com/storyblok/storyblok-js-client/blob/main/src/sbHelpers.ts
export type Region = 'eu' | 'us'

export const isRegion = (data: unknown): data is Region =>
  data === 'eu' || data === 'us'
