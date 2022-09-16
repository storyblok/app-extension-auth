import { Role } from './role'
import { isRole } from './isRole'

export const isRoles = (obj: unknown): obj is Role[] =>
  Array.isArray(obj) && obj.every(isRole)
