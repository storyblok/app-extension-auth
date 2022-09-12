import { hasKey } from '@src/utils/validation/hasKey'
import { isStoryblokGrantResponse } from '@src/storyblok-auth-api/grant/StoryblokGrantResponse/isStoryblokGrantResponse'
import { StoryblokGrantSession } from '@src/storyblok-auth-api/grant/StoryblokGrantSession/StoryblokGrantSession'

// TODO add tests

export const isStoryblokGrantSession = (
  obj: unknown,
): obj is StoryblokGrantSession =>
  hasKey(obj, 'provider') &&
  hasKey(obj, 'response') &&
  obj.provider === 'storyblok' &&
  isStoryblokGrantResponse(obj.response)
