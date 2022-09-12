import { hasKey } from '@src/utils/validation/hasKey'
import { StoryblokGrantCookie } from '@src/storyblok-auth-api/grant/StoryblokGrantCookie/StoryblokGrantCookie'
import { isStoryblokGrantSession } from '@src/storyblok-auth-api/grant/StoryblokGrantSession/isStoryblokGrantSession'

// TODO add tests

export const isStoryblokGrantCookie = (
  obj: unknown,
): obj is StoryblokGrantCookie =>
  hasKey(obj, 'grant') && isStoryblokGrantSession(obj.grant)
