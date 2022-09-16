import { AppSessionQuery } from '@src/session/types/AppSessionKeys'

export const isAppSessionQuery = (obj: unknown): obj is AppSessionQuery => {
  if (
    !(
      typeof obj === 'object' &&
      obj !== null &&
      'userId' in obj &&
      'spaceId' in obj
    )
  ) {
    return false
  }
  const r = obj as Record<string, unknown>
  return (
    (typeof r.userId === 'string' || typeof r.userId === 'number') &&
    (typeof r.spaceId === 'string' || typeof r.spaceId === 'number')
  )
}
