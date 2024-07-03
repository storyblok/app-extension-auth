import http from 'http'
import { AuthHandlerParams } from './AuthHandlerParams'
import { handleAnyRequest } from './handle-requests'
import { reconcileNodeResponse } from './reconcileNodeResponse'
import { cookieAdapter } from '../session-adapters/cookieAdapter'
import { createInternalAdapter } from '../session-adapters/internalAdapter'
import { getQueryParams } from '../utils/query-params/get-query-params'
import { sessionIdentifier } from '../session/sessionIdentifier'

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

    const query = getQueryParams(url)
    const isInitRequest = query.get('init_oauth')

    // NOTE: This is a workaround to remove a stale cookie in case the user has reinstalled the plugin.
    if (isInitRequest === 'true') {
      await internalAdapter.removeItem(sessionIdentifier(params))
    }

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
