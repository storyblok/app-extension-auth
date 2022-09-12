import { Role } from '@src/storyblok-auth-api'
import { hasKey } from '@src/utils/validation/hasKey'

export const isRole = (obj: unknown): obj is Role =>
  hasKey(obj, 'name') && typeof obj.name === 'string'
