import http from 'http'
import { AuthHandlerParams } from '../storyblok-auth-api/AuthHandlerParams'
import { expireNodeCookie, getNodeCookie, setNodeCookie } from './index'
import { HandleAuthRequestResult } from '../storyblok-auth-api/custom-handler/auth-request-handlers/types/HandleAuthRequestResult'
import { handleAuthRequest } from '../storyblok-auth-api/handle-auth-request'

export const handleNodeRequest = (
  params: AuthHandlerParams,
): http.RequestListener => {
  return async (req, res) => {
    if (typeof req.url !== 'string') {
      res.writeHead(400).end()
      return
    }
    const results = await handleAuthRequest(req.url, getNodeCookie(req))(params)
    handleNodeRequestResult(results)(req, res)
  }
}

const handleNodeRequestResult =
  (result: HandleAuthRequestResult): http.RequestListener =>
  (_req, res) => {
    console.log(result)
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
