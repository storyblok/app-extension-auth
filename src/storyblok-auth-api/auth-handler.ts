import http from 'http'
import { AuthHandlerParams } from './AuthHandlerParams'
import { handleAnyRequest } from './handle-requests'
import { reconcileNodeResponse } from './reconcileNodeResponse'
import { cookieAdapter } from '../session-adapters/cookieAdapter'
import { createInternalAdapter } from '../session-adapters/internalAdapter'

/**
 * Auth handler for Node.js
 * @param params
 */
export const authHandler = (
  params: AuthHandlerParams,
): http.RequestListener => {
  return async (req, res) => {
    const { url } = req
    if (typeof url !== 'string') {
      res.writeHead(400).end()
      return
    }

    const adapter = createInternalAdapter({
      params,
      req,
      res,
      adapter: cookieAdapter,
    })

    const responseElement = await handleAnyRequest({
      params,
      url,
      adapter,
    })

    await reconcileNodeResponse({
      res,
      responseElement,
    })
  }
}
