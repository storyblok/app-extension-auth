import { UserInfo } from '../user-info/UserInfo/user-info'

export type StoryblokGrantResponse = {
  refresh_token: string
  access_token: string
  profile: UserInfo
  raw: {
    expires_in: number
  }
}
