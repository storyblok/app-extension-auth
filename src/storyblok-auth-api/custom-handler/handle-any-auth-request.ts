import http from 'http'
import { callbackEndpoint, signinEndpoint } from './api-paths'
import { handleSignin } from './handleSignIn/handle-signin'
import { handleCallback } from './handleCallback/handle-callback'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { validateAppBaseUrl } from '../validation/validateAppBaseUrl'
import { validateEndpointPrefix } from '../validation/validateEndpointPrefix'
import url from 'url'
import { GetCookie, SetCookie } from '../../types/cookie'
import { expireNodeCookie, setNodeCookie } from '../../node'
import { HandleAuthRequestResult } from './HandleAuthRequest/HandleAuthRequestResult'
import { handleUnknownEndpoint } from './handleUnknownEndpoint/handle-unknown-endpoint'

export type HandleAnyAuthRequestParams = AuthHandlerParams & {
  getCookie: GetCookie
  setCookie: SetCookie
}

export const handleAnyAuthRequest = (
  params: HandleAnyAuthRequestParams,
): http.RequestListener => {
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
  return async (req, res) => {
    if (typeof req.url !== 'string') {
      res.writeHead(400).end()
      return
    }
    const slugs = req.url && url.parse(req.url)?.pathname?.split('/')
    const lastSlug = slugs && slugs[slugs.length - 1]
    handleResult(await handleSlug(req.url)(params, lastSlug))(req, res)
  }
}

const handleSlug =
  (url: string) =>
  (
    params: HandleAnyAuthRequestParams,
    slug: string | undefined,
  ): Promise<HandleAuthRequestResult> => {
    switch (slug) {
      case signinEndpoint:
        console.log('signing in')
        return handleSignin(params)
      case callbackEndpoint:
        console.log('handling callback')
        return handleCallback(url)(params)
      default:
        console.log('unknown endpoint')
        return handleUnknownEndpoint(params)
    }
  }

const handleResult =
  (result: HandleAuthRequestResult): http.RequestListener =>
  (_req, res) => {
    // const getCookie = getNodeCookie(req)
    const setCookie = setNodeCookie(res)
    const expireCookie = expireNodeCookie(res)

    result.setCookies.forEach(({ name, value }) =>
      typeof value === 'undefined'
        ? expireCookie(name)
        : setCookie(name, value),
    )

    console.log(result)
    res
      .writeHead(302, {
        Location: result.redirectTo,
      })
      .end()
  }
