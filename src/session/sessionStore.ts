import { AppSessionCookieStoreFactory, AppSessionStore } from './types'
import { getAllSessions, getSession, putSession, removeSession } from './crud'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import { GetCookie, SetCookie } from '../utils'
import { createInternalAdapter } from '../session-adapters/createInternalAdapter'
import { cookieAdapter } from '../session-adapters/cookieAdapter'

export const sessionStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const internalAdapter = createInternalAdapter({
      req: requestParams.req,
      res: requestParams.res,
      adapter: cookieAdapter,
    })

    //TODO: Make this more agnostic
    const getSessions: GetCookie = async (name) => internalAdapter.getItem(name)

    const setSessions: SetCookie = async (name, value) =>
      internalAdapter.setItem({
        key: name,
        value,
      })

    return {
      get: async (keys) =>
        refreshStoredAppSession(
          params,
          getSessions,
          setSessions,
          await getSession(params, getSessions, keys),
        ),
      getAll: async () => getAllSessions(params, getSessions),
      put: async (session) =>
        putSession(params, getSessions, setSessions, session),
      remove: async (keys) =>
        removeSession(params, getSessions, setSessions, keys),
    }
  }
