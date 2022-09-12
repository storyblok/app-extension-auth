import { storyblokIssuer } from '@src/storyblok-auth-api/storyblok-issuer'
import { AppParams } from '@src/storyblok-auth-api/params/app-params'

export const refreshToken =
  (params: AppParams) => async (refreshToken: string) => {
    const refreshClient = new storyblokIssuer.Client({
      client_id: params.appClientId,
      client_secret: params.appClientSecret,
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
