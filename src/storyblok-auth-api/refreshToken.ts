import { token_endpoint } from './storyblok-oauth-api-endpoints'
import { hasKey } from '../utils'
import { trimSlashes } from '../utils/trimSlashes/trimSlashes'
import { AuthHandlerParams } from './AuthHandlerParams'

export type RefreshTokenWithFetchParams = Pick<
  AuthHandlerParams,
  'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
>

const isTokenResponse = (
  data: unknown,
): data is { access_token: string; expires_in: number } =>
  hasKey(data, 'access_token') &&
  typeof data.access_token === 'string' &&
  hasKey(data, 'expires_in') &&
  typeof data.expires_in === 'number'

export type RefreshTokenResponse =
  | { access_token: string; expires_in: number }
  | undefined

/**
 * Uses a refresh token to request a new accessToken
 * @param fetchRequest
 */
export const refreshToken =
  (fetchRequest: typeof fetch) =>
  (params: RefreshTokenWithFetchParams) =>
  async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const formData = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: params.clientId,
        client_secret: params.clientSecret,
        redirect_uri: params.endpointPrefix
          ? `${trimSlashes(params.baseUrl)}/${trimSlashes(
              params.endpointPrefix,
            )}/storyblok/callback`
          : `${trimSlashes(params.baseUrl)}/storyblok/callback`,
      }
      const formBody = new URLSearchParams(formData).toString()
      const res = await fetchRequest(token_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formBody,
      })
      if (!res.ok) {
        const textMessage = await res.text()
        console.error(
          `Failed to refresh token. Server responded with "${textMessage}". Check your parameters: ${Object.keys(
            formData,
          )}`,
        )
        return undefined
      }
      const tokenData = (await res.json()) as unknown
      if (!isTokenResponse(tokenData)) {
        console.error(
          'Unexpected format: the server returned an object with an unexpected format',
        )
        return undefined
      }
      return {
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
      }
    } catch (e) {
      console.error('Refresh token failed with an exception')
      return undefined
    }
  }
