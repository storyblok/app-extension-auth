import { BaseClient, Issuer } from 'openid-client'
import { redirectUri } from './redirectUri'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { oauthApiBaseUrl } from './oauthApiBaseUrl'

export type CreateOpenIdClient = (
  params: Pick<
    AuthHandlerParams,
    'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
  >,
  spaceId: number,
) => BaseClient

export const openidClient: CreateOpenIdClient = (params, spaceId) => {
  const { clientId, clientSecret } = params
  const { Client } = new Issuer({
    issuer: 'storyblok',
    authorization_endpoint: `${oauthApiBaseUrl(spaceId)}/authorize`,
    token_endpoint: `${oauthApiBaseUrl(spaceId)}/token`,
    userinfo_endpoint: `${oauthApiBaseUrl(spaceId)}/user_info`,
  })
  return new Client({
    token_endpoint_auth_method: 'client_secret_post',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri(params)],
    response_types: ['code'],
  })
}
