import http from 'http'
import { AuthHandlerParams } from '../storyblok-auth-api/AuthHandlerParams'
import { GetCookie, SetCookie } from '../types/cookie'
import { expireNodeCookie, setNodeCookie } from './index'
import { HandleAuthRequestResult } from '../storyblok-auth-api/custom-handler/HandleAuthRequest/HandleAuthRequestResult'
import { handleAuthRequest } from '../storyblok-auth-api/handle-auth-request'

export type HandleAnyAuthRequestParams = AuthHandlerParams & {
  getCookie: GetCookie
  setCookie: SetCookie
}

export const nodeAuthRequestHandler = (
  params: HandleAnyAuthRequestParams,
): http.RequestListener => {
  return async (req, res) => {
    if (typeof req.url !== 'string') {
      res.writeHead(400).end()
      return
    }
    const results = await handleAuthRequest(req.url)(params)
    nodeHandleAuthResult(results)(req, res)
  }
}

const nodeHandleAuthResult =
  (result: HandleAuthRequestResult): http.RequestListener =>
  (_req, res) => {
    if (result.message) {
      // TODO handle better. We want to print an error if the app is misconfigured
      console.error(result.message)
    }

    result.setCookies?.forEach(({ name, value }) =>
      typeof value === 'undefined'
        ? expireNodeCookie(res)(name)
        : setNodeCookie(res)(name, value),
    )

    res
      .writeHead(302, {
        Location: result.redirectTo,
      })
      .end()
  }
