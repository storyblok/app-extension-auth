import { AppSessionStore } from '@src/session/app-session-store'
import {
  AppSession,
  AppSessionKeys,
  AppSessionQuery,
} from '@src/session/app-session'
import { RequestParams } from '@src/session/request-params'
import { AppParams } from '@src/storyblok-auth-api/params/app-params'
import { getSignedCookie } from '@src/utils/signed-cookie/get-signed-cookie'
import { setSignedCookie } from '@src/utils/signed-cookie/set-signed-cookie'

export type AppSessionCookieStoreFactory = (
  staticParams: CookieParams & AppParams,
) => (requestParams: RequestParams) => AppSessionStore

export type CookieParams = {
  jwtSecret: string
  // The name of the cookie that will be issued by this api endpoint handler
  cookieName: string
}

const toKeys = (keys: AppSessionQuery): AppSessionKeys => {
  const { spaceId, userId } = keys
  return {
    spaceId: typeof spaceId === 'number' ? spaceId : parseInt(spaceId, 10),
    userId: typeof userId === 'number' ? userId : parseInt(userId, 10),
  }
}

export const isAppSessionQuery = (obj: unknown): obj is AppSessionQuery => {
  if (
    !(
      typeof obj === 'object' &&
      obj !== null &&
      'userId' in obj &&
      'spaceId' in obj
    )
  ) {
    return false
  }
  const r = obj as Record<string, unknown>
  return (
    (typeof r.userId === 'string' || typeof r.userId === 'number') &&
    (typeof r.spaceId === 'string' || typeof r.spaceId === 'number')
  )
}
type AppSessionCookiePayload = {
  sessions: AppSession[]
}

export const simpleSessionCookieStore: AppSessionCookieStoreFactory =
  (params) => (requestParams) => {
    const { cookieName, appClientId, jwtSecret } = params
    const { req, res } = requestParams
    const getCookie =
      getSignedCookie(jwtSecret)<AppSessionCookiePayload>(cookieName)
    const setCookie =
      setSignedCookie(jwtSecret)<AppSessionCookiePayload>(cookieName)
    const getSessions = () => (getCookie(req) ?? { sessions: [] }).sessions
    return {
      get: async (params) =>
        getSessions().find(matches({ ...toKeys(params), appClientId })),
      getAll: async () =>
        getSessions().filter((session) => session.appClientId === appClientId),
      put: async (session) => {
        const filter = matches(session)
        const otherSessions = getSessions().filter((s) => !filter(s))
        const allSessions = [...otherSessions, session]

        setCookie({ sessions: allSessions })(res)
        return session
      },
      remove: async (params) => {
        const sessions = getSessions()
        const toRemove = sessions.find(
          matches({ ...toKeys(params), appClientId }),
        )
        const allOther = sessions.filter((s) => s !== toRemove)
        setCookie({ sessions: allOther })(res)
        return toRemove
      },
    }
  }

const matches =
  (a: AppSessionKeys & { appClientId: string }) =>
  (b: AppSessionKeys & { appClientId: string }) =>
    a.appClientId === b.appClientId &&
    a.spaceId === b.spaceId &&
    a.userId === b.userId
