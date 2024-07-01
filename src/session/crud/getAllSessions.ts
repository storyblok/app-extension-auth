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
  getSessions: GetCookie,
) => Promise<AppSession[]>

export const getAllSessions: GetAllSessions = async (params, getSessions) => {
  const cookie = await getSessions(sessionIdentifier(params))
  if (!isAppSessionCookiePayload(cookie)) {
    return []
  }
  return cookie.sessions
}
