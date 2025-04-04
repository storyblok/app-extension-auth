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

export const openidClient: CreateOpenIdClient = (params, region = 'eu') => {
  const { clientId, clientSecret } = params
  const userinfoEndpoint =
    process.env.APP_CUSTOM_OAUTH_ENDPOINT ?? `${getRegionBaseUrl(region)}`
  const tokenEndpoint =
    process.env.APP_CUSTOM_OAUTH_ENDPOINT ?? `${getRegionBaseUrl(region)}`
  const authorizationEndpoint =
    process.env.APP_CUSTOM_OAUTH_ENDPOINT ?? `https://app.storyblok.com`

  const { Client } = new Issuer({
    issuer: 'storyblok',
    authorization_endpoint: `${authorizationEndpoint}/oauth/authorize`,
    token_endpoint: `${tokenEndpoint}/oauth/token`,
    userinfo_endpoint: `${userinfoEndpoint}/oauth/user_info`,
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
