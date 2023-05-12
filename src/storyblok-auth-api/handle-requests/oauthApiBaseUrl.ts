const isEuSpace = (spaceId: number) => spaceId >= 0 && spaceId < 1000000
const isUsSpace = (spaceId: number) => spaceId >= 1000000 && spaceId < 2000000

/**
 * Given a spaceId, returns the API base url for authenticating with oauth
 * @param spaceId
 */
export const oauthApiBaseUrl = (spaceId: number) => {
  if (isEuSpace(spaceId)) {
    return 'https://app.storyblok.com/oauth'
  }
  if (isUsSpace(spaceId)) {
    return 'https://app.storyblok.com/v1_us/oauth'
  } else {
    // TODO type-safe error handling
    throw new Error(
      'The spaceId belongs to an unrecognized region. Supported regions are: EU, US. Please upgrade @storyblok/app-extension-auth to a newer version.',
    )
  }
}
