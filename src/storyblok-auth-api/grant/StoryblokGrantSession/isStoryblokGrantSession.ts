// TODO add tests

import { hasKey } from '../../../utils/hasKey/hasKey'
import { StoryblokGrantSession } from './StoryblokGrantSession'
import { isStoryblokGrantResponse } from '../StoryblokGrantResponse/isStoryblokGrantResponse'

export const isStoryblokGrantSession = (
  obj: unknown,
): obj is StoryblokGrantSession =>
  hasKey(obj, 'provider') &&
  hasKey(obj, 'response') &&
  obj.provider === 'storyblok' &&
  isStoryblokGrantResponse(obj.response)
