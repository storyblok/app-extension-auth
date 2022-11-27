import { AuthHandlerParams } from '../../storyblok-auth-api'
import { GetCookie } from '../../types/cookie'
import { AppSession } from '../types'
import { getSignedCookie } from '../../utils/signed-cookie/get-signed-cookie'
import { authCookieName } from '../authCookieName'
import { AppSessionCookiePayload } from './types/AppSessionCookiePayload'

export type GetAllSessionsParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>
export type GetAllSessions = (
  params: GetAllSessionsParams,
) => (getCookie: GetCookie) => AppSession[]
export const getAllSessions: GetAllSessions = (params) => (getCookie) => {
  const signedCookie = getSignedCookie(params.clientSecret)(getCookie)(
    authCookieName(params),
  ) as AppSessionCookiePayload
  //  TODO validate at runtime
  return signedCookie?.sessions ?? []
}
