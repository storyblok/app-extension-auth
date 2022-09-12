import { StoryblokGrantResponse } from '@src/storyblok-auth-api/grant/storyblok-grant-response'

export type StoryblokGrantSession = {
  provider: 'storyblok'
  response: StoryblokGrantResponse
}
