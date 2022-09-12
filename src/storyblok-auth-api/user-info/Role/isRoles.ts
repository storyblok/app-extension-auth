import { Role } from '@src/storyblok-auth-api'
import { isRole } from '@src/storyblok-auth-api/user-info/Role/isRole'

export const isRoles = (obj: unknown): obj is Role[] =>
  Array.isArray(obj) && obj.every(isRole)
