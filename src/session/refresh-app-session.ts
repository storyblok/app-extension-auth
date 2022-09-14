import { refreshToken } from '@src/storyblok-auth-api/refresh-token'
import { AppSession } from '@src/session/app-session-types'
import { AuthHandlerParams } from '@src/storyblok-auth-api'

type Params = Pick<AuthHandlerParams, 'clientId' | 'clientSecret'>

/**
 * Returns a new session that is refreshed
 * @return a session that is refreshed
 * @param params
 */
export const refreshAppSession =
  (params: Params) =>
  async (oldSession: AppSession): Promise<AppSession | undefined> => {
    if (!oldSession.refreshToken) {
      return undefined
    }
    const refreshedValue = await refreshToken(params)(oldSession.refreshToken)
    if (!refreshedValue) {
      return undefined
    }
    return {
      ...oldSession,
      accessToken: refreshedValue.access_token,
      expiresAt: Date.now() + refreshedValue.expires_in * 1000,
    }
  }
