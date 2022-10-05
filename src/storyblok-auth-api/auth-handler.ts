import { authorizedHandler } from './grant/authorized-handler'
import * as url from 'url'
import { RequestHandler } from './RequestHandler'
import { callbackRouteSlug, grantHandler } from './grant/grant-handler'
import { validateAppBaseUrl } from './validation/validateAppBaseUrl'
import { validateEndpointPrefix } from './validation/validateEndpointPrefix'
import { AuthHandlerParams } from './AuthHandlerParams'

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
