import { storyblokIssuer } from '@src/storyblok-auth-api/storyblok-issuer'
import { AuthHandlerParams } from '@src/storyblok-auth-api/auth-handler'

type Params = Pick<AuthHandlerParams, 'clientId' | 'clientSecret'>

/**
 * Uses a refresh token to request a new accessToken
 * @param params
 */
export const refreshToken =
  (params: Params) =>
  async (
    refreshToken: string,
  ): Promise<{ access_token: string; expires_in: number } | undefined> => {
    try {
      const refreshClient = new storyblokIssuer.Client({
        client_id: params.clientId,
        client_secret: params.clientSecret,
      })
      const { access_token, expires_in } = await refreshClient.refresh(
        refreshToken,
      )
      if (!access_token || !expires_in) {
        return undefined
      }
      return { access_token, expires_in }
    } catch (e) {
      return undefined
    }
  }
