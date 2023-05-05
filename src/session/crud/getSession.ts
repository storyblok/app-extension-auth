import { AuthHandlerParams } from '../../storyblok-auth-api'
import { AppSession, AppSessionQuery } from '../types'
import { getAllSessions } from './getAllSessions'
import { keysEquals } from './utils/keysEquals'
import { GetCookie } from '../../utils'
import { keysFromQuery } from './utils/keysFromQuery'

export type GetSessionParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>

export type GetSession = (
  params: GetSessionParams,
  getCookie: GetCookie,
  query: AppSessionQuery,
) => AppSession | undefined
export const getSession: GetSession = (params, getCookie, query) => {
  const keys = {
    ...keysFromQuery(query),
    appClientId: params.clientId,
  }
  const areSessionsEqual = keysEquals(keys)
  return getAllSessions(params, getCookie).find(areSessionsEqual)
}
