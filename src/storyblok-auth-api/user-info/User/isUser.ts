import { User } from '@src/storyblok-auth-api'
import { hasKey } from '@src/utils/validation/hasKey'

export const isUser = (obj: unknown): obj is User =>
  hasKey(obj, 'id') &&
  typeof obj.id === 'number' &&
  hasKey(obj, 'friendly_name') &&
  typeof obj.friendly_name === 'string'
