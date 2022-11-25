import {
  AppSession,
  CreateSessionCookieStore,
  AppSessionKeys,
  AppSessionQuery,
} from './types'
import { getSignedCookie } from '../utils/signed-cookie/get-signed-cookie'
import { setSignedCookie } from '../utils/signed-cookie/set-signed-cookie'
import { AuthHandlerParams } from '../storyblok-auth-api'
import { GetCookie } from '../types/cookie'

const toKeys = (keys: AppSessionQuery): AppSessionKeys => {
  const { spaceId, userId } = keys
  return {
    spaceId: typeof spaceId === 'number' ? spaceId : parseInt(spaceId, 10),
    userId: typeof userId === 'number' ? userId : parseInt(userId, 10),
  }
}

type AppSessionCookiePayload =
  | {
      sessions: AppSession[]
    }
  | undefined

const defaultCookieName = 'sb.auth'
export const authCookieName = (params: Pick<AuthHandlerParams, 'cookieName'>) =>
  params.cookieName ?? defaultCookieName

type GetAllSessions = (
  params: Pick<AuthHandlerParams, 'clientSecret' | 'cookieName' | 'clientId'>,
) => (getCookie: GetCookie) => AppSession[]

export const getAllSessions: GetAllSessions = (params) => (getCookie) => {
  const signedCookie = getSignedCookie(params.clientSecret)(getCookie)(
    authCookieName(params),
  ) as AppSessionCookiePayload
  //  TODO validate at runtime
  return signedCookie?.sessions ?? []
}

/**
 * Doesn't refresh the cookie
 * @param params
 */
export const simpleSessionCookieStore: CreateSessionCookieStore = (params) => {
  const { clientId } = params
  const getSessions = (): AppSession[] => {
    const signedCookie = getSignedCookie(params.clientSecret)(params.getCookie)(
      authCookieName(params),
    ) as AppSessionCookiePayload
    return signedCookie?.sessions ?? []
  }
  const setSessions = (sessions: AppSession[]) => {
    setSignedCookie(params.clientSecret)(params.setCookie)(
      authCookieName(params),
    )({
      sessions,
    })
  }
  return {
    get: async (params) =>
      getSessions().find(matches({ ...toKeys(params), appClientId: clientId })),
    getAll: async () =>
      getSessions().filter((session) => session.appClientId === clientId),
    put: async (session) => {
      const filter = matches(session)
      const otherSessions = getSessions().filter((s) => !filter(s))
      const allSessions = [...otherSessions, session]

      setSessions(allSessions)
      return session
    },
    remove: async (params) => {
      const sessions = getSessions()
      const toRemove = sessions.find(
        matches({ ...toKeys(params), appClientId: clientId }),
      )
      const allOtherSessions = sessions.filter((s) => s !== toRemove)
      setSessions(allOtherSessions)
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
