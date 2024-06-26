import { BaseClient, Issuer, custom } from 'openid-client'
import { redirectUri } from './redirectUri'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { getRegionUrl, Region } from '@storyblok/region-helper'

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
    // TODO: at this point there is no region && the subdomains do not have the /oauth/authorize endpoint working at the moment that is why this endpoint is initially requested
    authorization_endpoint: `https://app.storyblok.com/oauth/authorize`,
    token_endpoint:
      typeof region !== 'undefined'
        ? `${getRegionUrl(region)}/oauth/token`
        : undefined,
    userinfo_endpoint:
      typeof region !== 'undefined'
        ? `${getRegionUrl(region)}/oauth/user_info`
        : undefined,
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
