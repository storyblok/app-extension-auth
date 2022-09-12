import { UserInfo } from '@src/storyblok-auth-api'
import { hasKey } from '@src/utils/validation/hasKey'
import { isUser } from '@src/storyblok-auth-api/user-info/User/isUser'
import { isSpace } from '@src/storyblok-auth-api/user-info/Space/isSpace'
import { isRoles } from '@src/storyblok-auth-api/user-info/Role/isRoles'

export const isUserInfo = (obj: unknown): obj is UserInfo =>
  hasKey(obj, 'user') &&
  isUser(obj.user) &&
  hasKey(obj, 'space') &&
  isSpace(obj.space) &&
  hasKey(obj, 'roles') &&
  isRoles(obj.roles)
