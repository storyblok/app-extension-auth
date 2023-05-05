import { AppSession, AppSessionQuery } from '../types'
import { AuthHandlerParams } from '../../storyblok-auth-api'
import { setAllSessions } from './setAllSessions'
import { getAllSessions } from './getAllSessions'
import { keysEquals } from './utils/keysEquals'
import { SetCookie, GetCookie } from '../../utils'
import { keysFromQuery } from './utils/keysFromQuery'

export type RemoveSessionParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>

export type RemoveSession = (
  params: RemoveSessionParams,
  getCookie: GetCookie,
  setCookie: SetCookie,
  query: AppSessionQuery,
) => AppSession | undefined
export const removeSession: RemoveSession = (
  params,
  getCookie,
  setCookie,
  query,
) => {
  const sessions = getAllSessions(params, getCookie)
  const keys = {
    ...keysFromQuery(query),
    appClientId: params.clientId,
  }
  const isEqual = keysEquals(keys)
  const toRemove = sessions.find(isEqual)
  const allOtherSessions = sessions.filter((s) => s !== toRemove)
  setAllSessions(params, setCookie, allOtherSessions)
  return toRemove
}
