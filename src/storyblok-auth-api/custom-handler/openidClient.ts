import { storyblokIssuer } from './storyblok-issuer'
import { BaseClient } from 'openid-client'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { redirectUri } from './redirect-uri'

export type CreateOpenIdClientParams = Pick<
  AuthHandlerParams,
  'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
>
export type CreateOpenIdClient = (
  params: CreateOpenIdClientParams,
) => BaseClient

export const createOpenidClient: CreateOpenIdClient = (params) =>
  new storyblokIssuer.Client({
    token_endpoint_auth_method: 'client_secret_post',
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uris: [redirectUri(params)],
    response_types: ['code'],
  })
