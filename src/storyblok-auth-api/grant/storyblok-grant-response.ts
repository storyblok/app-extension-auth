import { UserInfo } from '@src/storyblok-auth-api'

export type StoryblokGrantResponse = {
  refresh_token: string
  access_token: string
  profile: UserInfo
  raw: {
    expires_in: number
  }
}
