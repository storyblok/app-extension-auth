import { hasKey } from '../../../utils'
import { Role } from './Role'

export const isRole = (obj: unknown): obj is Role =>
  hasKey(obj, 'name') && typeof obj.name === 'string'
