import { User } from '@src/storyblok-auth-api/user-info/User/user'
import { Space } from '@src/storyblok-auth-api/user-info/Space/space'
import { Role } from '@src/storyblok-auth-api/user-info/Role/role'

/**
 * The data that is returned from https://app.storyblok.com/oauth/user_info
 */
export type UserInfo = {
  user: User
  space: Space
  roles: Role[]
}
