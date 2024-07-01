import { AppSession } from '../types'
import { SetCookie } from '../../utils'
import { sessionIdentifier } from '../sessionIdentifier'
import { AuthHandlerParams } from '../../storyblok-auth-api'

export type SetAllSessionsParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>
export type SetAllSessions = (
  params: SetAllSessionsParams,
  setCookie: SetCookie,
  sessions: AppSession[],
) => Promise<void>
export const setAllSessions: SetAllSessions = async (
  params,
  setCookie,
  sessions,
) => setCookie(sessionIdentifier(params), { sessions })
