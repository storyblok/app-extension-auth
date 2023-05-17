import { Region } from '../../session'

/**
 * Given a region, returns the API base url for authenticating with oauth
 * @param region
 */
export const oauthApiBaseUrl = (region: Region) => {
  switch (region) {
    case 'eu':
      return 'https://app.storyblok.com/oauth'
    case 'us':
      return 'https://app.storyblok.com/v1_us/oauth'
  }
}
