// As in https://github.com/storyblok/storyblok-js-client/blob/main/src/sbHelpers.ts
export type Region = 'eu' | 'us' | 'ca' | 'cn' | 'ap'

export const isRegion = (data: unknown): data is Region =>
  data === 'eu' ||
  data === 'us' ||
  data === 'cn' ||
  data === 'ca' ||
  data === 'ap'
