import { AppSession } from '../types'
import { setSignedCookie } from '../../utils/signed-cookie/set-signed-cookie'
import { authCookieName } from '../authCookieName'
import { SetCookie } from '../../types/cookie'
import { AuthHandlerParams } from '../../storyblok-auth-api'

export type SetAllSessionsParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>
export type SetAllSessions = (
  params: SetAllSessionsParams,
) => (setCookie: SetCookie) => (sessions: AppSession[]) => void
export const setAllSessions: SetAllSessions =
  (params) => (setCookie) => (sessions) => {
    setSignedCookie(params.clientSecret)(setCookie)(authCookieName(params))({
      sessions,
    })
  }
