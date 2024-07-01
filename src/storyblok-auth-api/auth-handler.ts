import http from 'http'
import { AuthHandlerParams } from './AuthHandlerParams'
import { handleAnyRequest } from './handle-requests'
import { reconcileNodeResponse } from './reconcileNodeResponse'
import { createInternalAdapter } from '../session-adapters/createInternalAdapter'
import { cookieAdapter } from '../session-adapters/cookieAdapter'

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

    const internalAdapter = createInternalAdapter({
      req,
      res,
      adapter: cookieAdapter,
    })

    const responseElement = await handleAnyRequest({
      params,
      url,
      adapter: internalAdapter,
    })

    await reconcileNodeResponse({
      res,
      responseElement,
      adapter: internalAdapter,
    })
  }
}
