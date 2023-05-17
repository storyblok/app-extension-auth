import { BaseClient, Issuer } from 'openid-client'
import { redirectUri } from './redirectUri'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { oauthApiBaseUrl } from './oauthApiBaseUrl'
import { Region } from '../../session'

export type CreateOpenIdClient = (
  params: Pick<
    AuthHandlerParams,
    'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
  >,
  region?: Region,
) => BaseClient

export const openidClient: CreateOpenIdClient = (params, region) => {
  const { clientId, clientSecret } = params
  const { Client } = new Issuer({
    issuer: 'storyblok',
    // This is always the eu endpoint, even for other regions
    authorization_endpoint: `${oauthApiBaseUrl('eu')}/authorize`,
    token_endpoint:
      typeof region !== 'undefined'
        ? `${oauthApiBaseUrl(region)}/token`
        : undefined,
    userinfo_endpoint:
      typeof region !== 'undefined'
        ? `${oauthApiBaseUrl(region)}/user_info`
        : undefined,
  })
  return new Client({
    token_endpoint_auth_method: 'client_secret_post',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri(params)],
    response_types: ['code'],
  })
}
