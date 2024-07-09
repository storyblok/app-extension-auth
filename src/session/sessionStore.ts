import {
  AppSessionCookieStoreFactory,
  AppSessionQuery,
  AppSessionStore,
} from './types'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import { cookieAdapter } from '../session-adapters/cookieAdapter'
import { createInternalAdapter } from '../session-adapters/internalAdapter'
import { IncomingMessage } from 'http'

export const getSessionStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const adapter = createInternalAdapter({
      params,
      req: requestParams.req,
      res: requestParams.res,
      adapter: cookieAdapter,
    })

    return {
      get: async ({ spaceId, userId }) => {
        const session = await adapter.getSession({
          spaceId: String(spaceId),
          userId: String(userId),
        })
        return await refreshStoredAppSession(params, adapter, session)
      },
      put: async (session) =>
        await adapter.setSession({
          spaceId: String(session.spaceId),
          userId: String(session.userId),
          session,
        }),
      remove: async ({ spaceId, userId }) =>
        await adapter.removeSession({
          spaceId: String(spaceId),
          userId: String(userId),
        }),
    }
  }

export const inferSessionQuery = (
  req: IncomingMessage,
): AppSessionQuery | undefined => {
  if (!req.url) {
    return
  }
  const url = new URL(req.url)
  const spaceId = url.searchParams.get('space_id')
  const userId = url.searchParams.get('user_id')
  if (spaceId && userId) {
    return {
      spaceId,
      userId,
    }
  }

  if (req.headers.referer) {
    const refererUrl = new URL(req.url)
    const spaceId = refererUrl.searchParams.get('space_id')
    const userId = refererUrl.searchParams.get('user_id')
    if (spaceId && userId) {
      return {
        spaceId,
        userId,
      }
    }
  }

  return undefined
}
