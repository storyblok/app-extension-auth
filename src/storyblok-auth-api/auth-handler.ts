import { authorizedHandler } from '@src/storyblok-auth-api/grant/authorized-handler'
import * as url from 'url'
import { RequestHandler } from '@src/storyblok-auth-api/RequestHandler'
import {
  callbackRouteSlug,
  grantHandler,
} from '@src/storyblok-auth-api/grant/grant-handler'
import { StoryblokScope } from '@src/storyblok-auth-api/StoryblokScope'
import { validateAppBaseUrl } from '@src/storyblok-auth-api/validation/validateAppBaseUrl'
import { validateEndpointPrefix } from '@src/storyblok-auth-api/validation/validateEndpointPrefix'

export type AuthHandlerParams = {
  /*
   * The client ID is a public identifier for your apps. Find the Client ID in the app settings on Storyblok.
   */
  clientId: string
  /*
   * The client secret is a secret known only to the application and the authorization server.
   * Find the client secret in the app settings on Storyblok.
   *
   * Load it into the application as an environmental variable.
   * It must be kept confidential.
   */
  clientSecret: string
  /*
   * The base URL specifies the base URL to use for all relative authentication API endpoints created by authHandler().
   * The base URL must be absolute and secure with https.
   *
   * For example, the base URL `https://my-app.my-domain.com/` will create the following api endpoints
   *  - `https://my-app.my-domain.com/storyblok` for initiating the authentication flow
   *  - `https://my-app.my-domain.com/storyblok/callback` as the OAuth2 callback URL
   */
  baseUrl: string
  /*
   * The scope determines what the app will request access to. It's a list of strings. The following values are accepted:
   * - `read_content`
   * - `write_content`
   */
  scope: StoryblokScope[]
  /*
   * The name of the cookie that contains the session data.
   */
  cookieName?: string
  /*
   * Specifies the URL that the user agent will be redirected to after a _successful_ authentication flow.
   *
   * Defaults to `"/"`.
   */
  successCallback?: string
  /*
   * Specifies the URL that the user agent will be redirected to after an _unsuccessful_ authentication flow.
   *
   * If omitted, the user agent will receive a 401 response without redirect.
   */
  errorCallback?: string
  /**
   * Specifies a partial URL that will be inserted between the baseUrl and the
   *  authentication API endpoints.
   *
   * For example
   * - `baseUrl: "https://app.com"`
   * - `endpointPrefix: "api/authenticate"`
   *
   * will result in the endpoints
   *
   *  - `https://my-app.my-domain.com/api/authenticate/storyblok` for initiating the authentication flow
   *  - `https://my-app.my-domain.com/api/authenticate/storyblok/callback` as the OAuth2 callback URL
   */
  endpointPrefix?: string
}

export const authHandler = (params: AuthHandlerParams): RequestHandler => {
  if (!validateAppBaseUrl(params.baseUrl)) {
    throw Error(
      `Invalid baseUrl: must be an absolute URL with the https protocol and not contain any query parameters. Received ${params.baseUrl}. Example value: "https://my-app.com"`,
    )
  }
  if (!validateEndpointPrefix(params.endpointPrefix)) {
    throw Error(
      `Invalid endpointPrefix: must either be undefined or be a partial slug (containing only characters, numbers, slashes, dashes, and underscored). Received: "${params.endpointPrefix}". Example value: api/authenticate`,
    )
  }
  return async (request, response) => {
    const slugs = request.url && url.parse(request.url)?.pathname?.split('/')
    const lastSlug = slugs && slugs[slugs.length - 1]
    switch (lastSlug) {
      case callbackRouteSlug: {
        // The grant callback path /authorized that will be invoked with a grant cookie when the flow has completed
        return authorizedHandler(params)(request, response)
      }
      default: {
        // Grant paths: 1) / for init flow, 2) /callback for completing it
        return grantHandler(params)(request, response)
      }
    }
  }
}
