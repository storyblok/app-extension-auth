import {
  AppSessionKeys,
  AppSessionQuery,
} from '@src/session/types/AppSessionKeys'
import { getSignedCookie } from '@src/utils/signed-cookie/get-signed-cookie'
import { setSignedCookie } from '@src/utils/signed-cookie/set-signed-cookie'
import { AppSessionCookieStoreFactory } from '@src/session/types/AppSessionCookieStoreFactory'
import { AppSession } from '@src/session/types/AppSession'

const toKeys = (keys: AppSessionQuery): AppSessionKeys => {
  const { spaceId, userId } = keys
  return {
    spaceId: typeof spaceId === 'number' ? spaceId : parseInt(spaceId, 10),
    userId: typeof userId === 'number' ? userId : parseInt(userId, 10),
  }
}

type AppSessionCookiePayload = {
  sessions: AppSession[]
}

const defaultCookieName = 'sb.auth'

export const simpleSessionCookieStore: AppSessionCookieStoreFactory =
  (params) => (requestParams) => {
    const { clientId, clientSecret } = params
    const cookieName = params.cookieName ?? defaultCookieName
    const { req, res } = requestParams
    const getCookie =
      getSignedCookie(clientSecret)<AppSessionCookiePayload>(cookieName)
    const setCookie =
      setSignedCookie(clientSecret)<AppSessionCookiePayload>(cookieName)
    const getSessions = () => (getCookie(req) ?? { sessions: [] }).sessions
    return {
      get: async (params) =>
        getSessions().find(
          matches({ ...toKeys(params), appClientId: clientId }),
        ),
      getAll: async () =>
        getSessions().filter((session) => session.appClientId === clientId),
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
          matches({ ...toKeys(params), appClientId: clientId }),
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
