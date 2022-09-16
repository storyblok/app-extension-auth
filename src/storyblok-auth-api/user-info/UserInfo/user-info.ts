/**
 * The data that is returned from https://app.storyblok.com/oauth/user_info
 */
import { User } from '../User/user'
import { Space } from '../Space/space'
import { Role } from '../Role/role'

export type UserInfo = {
  user: User
  space: Space
  roles: Role[]
}
