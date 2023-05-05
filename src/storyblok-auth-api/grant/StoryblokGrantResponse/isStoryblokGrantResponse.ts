// TODO add tests

import { StoryblokGrantResponse } from '../StoryblokGrantResponse'
import { hasKey } from '../../../utils'
import { isUserInfo } from '../../user-info/UserInfo/isUserInfo'

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
