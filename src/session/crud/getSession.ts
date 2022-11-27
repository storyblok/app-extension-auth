import { AuthHandlerParams } from '../../storyblok-auth-api'
import { GetCookie } from '../../types/cookie'
import { AppSession, AppSessionQuery } from '../types'
import { keysFromQuery } from '../keysFromQuery'
import { getAllSessions } from './getAllSessions'
import { keysEquals } from './utils/keys-equals'

export type GetSessionParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'cookieName' | 'clientId'
>
export type GetSession = (
  params: GetSessionParams,
) => (
  getCookie: GetCookie,
) => (query: AppSessionQuery) => AppSession | undefined
export const getSession: GetSession = (params) => (getCookie) => (query) => {
  const keys = {
    ...keysFromQuery(query),
    appClientId: params.clientId,
  }
  const areSessionsEqual = keysEquals(keys)
  console.log('query', query)
  console.log('keys', keys)
  // console.log(getAllSessions(params)(getCookie))
  return getAllSessions(params)(getCookie).find(areSessionsEqual)
}
