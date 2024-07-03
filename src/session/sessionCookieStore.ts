import { AppSessionCookieStoreFactory, AppSessionStore } from './types'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import { cookieAdapter } from '../session-adapters/cookieAdapter'
import { createInternalAdapter } from '../session-adapters/internalAdapter'

export const getSessionStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const adapter = createInternalAdapter({
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

/**
 * @deprecated `sessionCookieStore` is deprecated. Use `getSessionStore` instead.
 */
export const sessionCookieStore = getSessionStore
