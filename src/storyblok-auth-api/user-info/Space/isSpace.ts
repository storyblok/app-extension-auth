import { Space } from '@src/storyblok-auth-api'
import { hasKey } from '@src/utils/validation/hasKey'

export const isSpace = (obj: unknown): obj is Space =>
  hasKey(obj, 'id') &&
  typeof obj.id === 'number' &&
  hasKey(obj, 'name') &&
  typeof obj.name === 'string'
