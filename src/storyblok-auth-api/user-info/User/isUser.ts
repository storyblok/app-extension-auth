import { hasKey } from '../../../utils/hasKey/hasKey'
import { User } from './user'

export const isUser = (obj: unknown): obj is User =>
  hasKey(obj, 'id') &&
  typeof obj.id === 'number' &&
  hasKey(obj, 'friendly_name') &&
  typeof obj.friendly_name === 'string'
