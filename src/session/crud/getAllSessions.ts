import { AuthHandlerParams } from '../../storyblok-auth-api'
import { AppSession } from '../types'
import { GetCookie } from '../../utils'
import { sessionIdentifier } from '../sessionIdentifier'
import { isAppSessionCookiePayload } from './AppSessionCookiePayload'

export type GetAllSessionsParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>

export type GetAllSessions = (
  params: GetAllSessionsParams,
  getCookie: GetCookie,
) => Promise<AppSession[]>

export const getAllSessions: GetAllSessions = async (params, getCookie) => {
  const cookie = await getCookie(sessionIdentifier(params))
  if (!isAppSessionCookiePayload(cookie)) {
    return []
  }
  return cookie.sessions
}
