import { hasKey } from '@src/utils/validation/hasKey'
import { isUserInfo } from '@src/storyblok-auth-api/user-info/UserInfo/isUserInfo'
import { StoryblokGrantResponse } from '@src/storyblok-auth-api/grant/storyblok-grant-response'

// TODO add tests

export const isStoryblokGrantResponse = (
  obj: unknown,
): obj is StoryblokGrantResponse =>
  hasKey(obj, 'refresh_token') &&
  typeof obj.refresh_token === 'string' &&
  hasKey(obj, 'access_token') &&
  typeof obj.access_token === 'string' &&
  hasKey(obj, 'profile') &&
  isUserInfo(obj.profile) &&
  hasKey(obj, 'raw') &&
  hasKey(obj.raw, 'expires_in') &&
  typeof obj.raw.expires_in === 'number'
