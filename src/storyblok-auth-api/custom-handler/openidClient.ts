import { BaseClient, Issuer } from 'openid-client'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { redirectUri } from './redirect-uri'

export type CreateOpenIdClientParams = Pick<
  AuthHandlerParams,
  'clientId' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
>
export type CreateOpenIdClient = (
  params: CreateOpenIdClientParams,
) => BaseClient

const oauthUrl = 'https://app.storyblok.com/oauth'
const userinfo_endpoint = `${oauthUrl}/user_info`
const authorization_endpoint = `${oauthUrl}/authorize`
const token_endpoint = `${oauthUrl}/token`

const storyblokIssuer = new Issuer({
  issuer: 'storyblok',
  authorization_endpoint,
  token_endpoint,
  userinfo_endpoint,
})

export const createOpenidClient: CreateOpenIdClient = (params) =>
  new storyblokIssuer.Client({
    token_endpoint_auth_method: 'client_secret_post',
    client_id: params.clientId,
    client_secret: params.clientSecret,
    redirect_uris: [redirectUri(params)],
    response_types: ['code'],
  })
