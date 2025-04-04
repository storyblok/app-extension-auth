import { BaseClient, Issuer, custom } from 'openid-client'
import { redirectUri } from './redirectUri'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { getRegionBaseUrl, Region } from '@storyblok/region-helper'

export type CreateOpenIdClient = (
  params: Pick<
    AuthHandlerParams,
    'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
  >,
  region?: Region,
) => BaseClient

export const openidClient: CreateOpenIdClient = (params, region) => {
  const { clientId, clientSecret } = params
  const userinfoEndpoint =
    typeof region !== 'undefined'
      ? process.env.APP_CUSTOM_USERINFO_ENDPOINT ??
        `${getRegionBaseUrl(region)}/oauth/user_info`
      : undefined
  const tokenEndpoint =
    typeof region !== 'undefined'
      ? process.env.APP_CUSTOM_TOKEN_ENDPOINT ??
        `${getRegionBaseUrl(region)}/oauth/token`
      : undefined
  const authorizationEndpoint =
    process.env.APP_CUSTOM_OAUTH_URL ??
    `https://app.storyblok.com/oauth/authorize`

  const { Client } = new Issuer({
    issuer: 'storyblok',
    authorization_endpoint: authorizationEndpoint,
    token_endpoint: tokenEndpoint,
    userinfo_endpoint: userinfoEndpoint,
  })

  const client = new Client({
    token_endpoint_auth_method: 'client_secret_post',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri(params)],
    response_types: ['code'],
  })

  // eslint-disable-next-line functional/immutable-data
  client[custom.http_options] = () => {
    return { timeout: 10000 }
  }

  return client
}
