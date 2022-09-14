import { storyblokIssuer } from '@src/storyblok-auth-api/storyblok-issuer'
import { AuthHandlerParams } from '@src/storyblok-auth-api/auth-handler'

type Params = Pick<AuthHandlerParams, 'clientId' | 'clientSecret'>

export const refreshToken =
  (params: Params) => async (refreshToken: string) => {
    const refreshClient = new storyblokIssuer.Client({
      client_id: params.clientId,
      client_secret: params.clientSecret,
    })
    const { access_token, expires_in } = await refreshClient.refresh(
      refreshToken,
    )
    if (!access_token || !expires_in) {
      throw new Error(
        `refresh response does not contain all required values: access_token defined: ${!!access_token}, expires_in defined: ${!!expires_in}`,
      )
    }
    return { access_token, expires_in }
  }
