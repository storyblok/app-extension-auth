import { AuthHandlerParams } from '../../storyblok-auth-api'
import { AppSession } from '../types'
import { getSignedCookie, GetCookie } from '../../utils'
import { authCookieName } from '../authCookieName'

export type AppSessionCookiePayload =
  | {
      sessions: AppSession[]
    }
  | undefined
export type GetAllSessionsParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>
export type GetAllSessions = (
  params: GetAllSessionsParams,
  getCookie: GetCookie,
) => AppSession[]
export const getAllSessions: GetAllSessions = (params, getCookie) => {
  const signedCookie = getSignedCookie(
    params.clientSecret,
    getCookie,
    authCookieName(params),
  ) as AppSessionCookiePayload
  //  TODO validate at runtime
  return signedCookie?.sessions ?? []
}
