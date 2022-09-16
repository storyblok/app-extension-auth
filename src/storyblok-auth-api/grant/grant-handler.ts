import grant from 'grant'
import { RequestHandler } from '../RequestHandler'
import { AuthHandlerParams } from '../auth-handler'
import { profile_url } from '../storyblok-oauth-api-endpoints'

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
          profile_url,
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
