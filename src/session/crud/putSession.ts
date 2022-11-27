import { AppSession } from '../types'
import { GetCookie, SetCookie } from '../../types/cookie'
import { AuthHandlerParams } from '../../storyblok-auth-api'
import { setAllSessions } from './setAllSessions'
import { getAllSessions } from './getAllSessions'
import { keysEquals } from './utils/keys-equals'

export type PutSessionParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>

export type PutSession = (
  params: PutSessionParams,
) => (
  getCookie: GetCookie,
) => (setCookie: SetCookie) => (session: AppSession) => AppSession
export const putSession: PutSession =
  (params) => (getCookie) => (setCookie) => (newSession) => {
    const isNotEqual = (otherSession: AppSession) =>
      !keysEquals(newSession)(otherSession)
    const otherSessions = getAllSessions(params)(getCookie).filter(isNotEqual)
    setAllSessions(params)(setCookie)([...otherSessions, newSession])
    return newSession
  }
