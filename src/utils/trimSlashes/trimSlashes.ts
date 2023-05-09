export const trimSlashes = (slugs: string): string =>
  slugs.match(/^\/*(.*?)\/*$/)?.[1] ?? ''
