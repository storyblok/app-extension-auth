export const trimSlashes = (slugs: string): string | undefined =>
  slugs.match(/^\/*(.*?)\/*$/)?.[1] ?? undefined
