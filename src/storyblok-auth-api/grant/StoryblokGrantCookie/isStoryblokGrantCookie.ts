// TODO add tests

import { StoryblokGrantCookie } from './StoryblokGrantCookie'
import { hasKey } from '../../../utils/hasKey/hasKey'
import { isStoryblokGrantSession } from '../StoryblokGrantSession/isStoryblokGrantSession'

export const isStoryblokGrantCookie = (
  obj: unknown,
): obj is StoryblokGrantCookie =>
  hasKey(obj, 'grant') && isStoryblokGrantSession(obj.grant)
