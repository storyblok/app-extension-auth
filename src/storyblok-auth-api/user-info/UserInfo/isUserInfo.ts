import { hasKey } from '../../../utils/hasKey/hasKey'
import { isUser } from '../User/isUser'
import { isSpace } from '../Space/isSpace'
import { isRoles } from '../Role/isRoles'
import { UserInfo } from './user-info'

export const isUserInfo = (obj: unknown): obj is UserInfo =>
  hasKey(obj, 'user') &&
  isUser(obj.user) &&
  hasKey(obj, 'space') &&
  isSpace(obj.space) &&
  hasKey(obj, 'roles') &&
  isRoles(obj.roles)
