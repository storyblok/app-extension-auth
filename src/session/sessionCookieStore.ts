import { AppSessionCookieStoreFactory, AppSessionStore } from './types'
import { getAllSessions, getSession, putSession, removeSession } from './crud'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import { GetCookie, SetCookie } from '../utils'
import { createInternalAdapter } from '../storyblok-auth-api/session-adapters/createInternalAdapter'
import { cookieAdapter } from '../storyblok-auth-api/session-adapters/cookieAdapter'

export const sessionCookieStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const internalAdapter = createInternalAdapter({
      req: requestParams.req,
      res: requestParams.res,
      adapter: cookieAdapter,
    })

    const getCookie: GetCookie = async (name) => internalAdapter.getItem(name)

    const setCookie: SetCookie = async (name, value) =>
      internalAdapter.setItem({
        key: name,
        value,
      })

    return {
      get: async (keys) =>
        refreshStoredAppSession(
          params,
          getCookie,
          setCookie,
          await getSession(params, getCookie, keys),
        ),
      getAll: async () => getAllSessions(params, getCookie),
      put: async (session) => putSession(params, getCookie, setCookie, session),
      remove: async (keys) => removeSession(params, getCookie, setCookie, keys),
    }
  }
