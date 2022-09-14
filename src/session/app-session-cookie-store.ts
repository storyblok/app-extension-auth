import { AppSessionStore } from '@src/session/app-session-store'
import {
  AppSession,
  AppSessionKeys,
  AppSessionQuery,
} from '@src/session/app-session-types'
import { RequestParams } from '@src/session/request-params'
import { getSignedCookie } from '@src/utils/signed-cookie/get-signed-cookie'
import { setSignedCookie } from '@src/utils/signed-cookie/set-signed-cookie'
import { AuthHandlerParams } from '@src/storyblok-auth-api'

type AppSessionCookieStoreFactoryParams = Pick<
  AuthHandlerParams,
  'clientId' | 'cookieName' | 'clientSecret'
>

export type AppSessionCookieStoreFactory = (
  params: AppSessionCookieStoreFactoryParams,
) => (requestParams: RequestParams) => AppSessionStore

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

export const simpleSessionCookieStore: AppSessionCookieStoreFactory =
  (params) => (requestParams) => {
    const { clientId, clientSecret } = params
    const cookieName = params.cookieName ?? 'storyblok'
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
