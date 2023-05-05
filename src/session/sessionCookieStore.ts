import { AppSessionCookieStoreFactory, AppSessionStore } from './types'
import { getAllSessions, getSession, putSession, removeSession } from './crud'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import { GetCookie, getCookie, SetCookie, setCookie } from '../utils'

export const sessionCookieStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const getNodeCookie: GetCookie = (name) =>
      getCookie(requestParams.req, name)
    const setNodeCookie: SetCookie = (name, value) =>
      setCookie(requestParams.res, name, value)
    return {
      get: async (keys) =>
        refreshStoredAppSession(
          params,
          getNodeCookie,
          setNodeCookie,
          getSession(params, getNodeCookie, keys),
        ),
      getAll: async () => getAllSessions(params, getNodeCookie),
      put: async (session) =>
        putSession(params, getNodeCookie, setNodeCookie, session),
      remove: async (keys) =>
        removeSession(params, getNodeCookie, setNodeCookie, keys),
    }
  }
