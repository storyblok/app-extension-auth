import { AuthHandlerParams } from '../../AuthHandlerParams'
import { AppSession } from '../../../session'
import { openidClient } from '../openidClient'
import { redirectUri } from '../redirectUri'
import { isTokenSet } from './isTokenSet'
import { isUserInfo } from '../../user-info/UserInfo/isUserInfo'

export const fetchAppSession = async (
  params: AuthHandlerParams,
  requestParams: {
    url: string
    spaceId: number
    codeVerifier: string
    state: string
  },
): Promise<AppSession | undefined> => {
  const { spaceId, codeVerifier, state, url } = requestParams

  const client = openidClient(params, spaceId)

  const callbackParams = client.callbackParams(url)
  const tokenSet = await client.oauthCallback(
    redirectUri(params),
    callbackParams,
    {
      code_verifier: codeVerifier,
      state: state,
    },
  )
  if (!isTokenSet(tokenSet)) {
    return undefined
  }
  // Storyblok do not conform to openid, so the userinfo object is not the same as in the openid specification:
  //  https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
  const userInfo = await client.userinfo(tokenSet.access_token)
  if (!isUserInfo(userInfo)) {
    return undefined
  }
  return {
    refreshToken: tokenSet.refresh_token,
    accessToken: tokenSet.access_token,
    expiresAt: Date.now() + tokenSet.expires_in * 1000,
    appClientId: params.clientId,
    roles: userInfo.roles.map((role) => role.name),
    spaceId: userInfo.space.id,
    spaceName: userInfo.space.name,
    userId: userInfo.user.id,
    userName: userInfo.user.friendly_name,
  }
}
