import {
  AuthHandlerParams,
  callbackEndpoint,
  HandleAuthRequestResult,
  handleCallback,
  handleSignIn,
  signinEndpoint,
} from './index'
import { validateAppBaseUrl } from './validation/validateAppBaseUrl'
import { validateEndpointPrefix } from './validation/validateEndpointPrefix'
import url from 'url'
import { handleUnknown } from './custom-handler/auth-request-handlers'
import { GetCookie } from '../types/cookie'

export const handleAuthRequest =
  (fullUrl: string, getCookie: GetCookie) =>
  async (params: AuthHandlerParams): Promise<HandleAuthRequestResult> => {
    if (!validateAppBaseUrl(params.baseUrl)) {
      return {
        type: 'configuration-error',
        message: `Invalid baseUrl: must be an absolute URL with the https protocol and not contain any query parameters. Received ${params.baseUrl}. Example value: "https://my-app.com"`,
      }
    }
    if (!validateEndpointPrefix(params.endpointPrefix)) {
      return {
        type: 'configuration-error',
        message: `Invalid endpointPrefix: must either be undefined or be a partial slug (containing only characters, numbers, slashes, dashes, and underscored). Received: "${params.endpointPrefix}". Example value: api/authenticate`,
      }
    }

    const slugs = url.parse(fullUrl)?.pathname?.split('/')
    const endpoint = slugs && slugs[slugs.length - 1]
    switch (endpoint) {
      case signinEndpoint:
        return handleSignIn(params)
      case callbackEndpoint:
        return handleCallback(fullUrl, getCookie)(params)
      default:
        return handleUnknown(params)
    }
  }
