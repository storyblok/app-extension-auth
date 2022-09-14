import grant from 'grant'
import { RequestHandler } from '@src/storyblok-auth-api/request-handler'
import { profile_url } from '@src/storyblok-auth-api/storyblok-issuer'
import { AuthHandlerParams } from '@src/storyblok-auth-api'

export type GrantHandlerParams = Pick<
  AuthHandlerParams,
  | 'successCallback'
  | 'errorCallback'
  | 'cookieName'
  | 'clientId'
  | 'clientSecret'
  | 'baseUrl'
  | 'endpointPrefix'
  | 'scope'
>

export const grantCookieName = 'grant'
export const callbackRouteSlug = 'authorized'

export const grantHandler =
  (params: GrantHandlerParams): RequestHandler =>
  async (req, res) => {
    const { clientId, clientSecret, endpointPrefix, baseUrl } = params
    void (await grant.node({
      config: {
        defaults: {
          origin: baseUrl,
          transport: 'session',
          prefix: endpointPrefix,
        },
        storyblok: {
          client_id: clientId,
          client_secret: clientSecret,
          scope: ['read_content'],
          callback: `${endpointPrefix}/${callbackRouteSlug}`,
          profile_url, // TODO add to grant profile.json > storyblok
          response: ['tokens', 'profile', 'raw'], // raw is needed for the expires_in, token is needed for profile
          pkce: true,
          state: true,
          token_endpoint_auth_method: 'client_secret_post',
        },
      },
      session: {
        secret: clientSecret,
        name: grantCookieName,
        cookie: {
          path: '/',
          secure: true,
          sameSite: 'none', // Needed since custom apps are embedded in iframes
          httpOnly: true, // The refresh token must not be accessible via client-side javascript
        },
      },
    })(req, res))
  }
