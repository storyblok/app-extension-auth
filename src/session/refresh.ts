import { AppSession } from './types'
import { shouldRefresh } from './shouldRefresh/shouldRefresh'
import { refreshAppSession } from './refreshAppSession/refreshAppSession'
import { refreshAccessToken } from '../storyblok-auth-api/refreshAccessToken'
import { removeSession } from './crud/removeSession'
import { putSession } from './crud/putSession'
import { AuthHandlerParams } from '../storyblok-auth-api'
import { GetCookie, SetCookie } from '../types/cookie'

export type RefreshParams = Pick<
  AuthHandlerParams,
  'clientSecret' | 'clientId' | 'baseUrl' | 'endpointPrefix'
>
export type Refresh = (
  params: RefreshParams,
) => (
  getCookie: GetCookie,
) => (
  setCookie: SetCookie,
) => (appSession: AppSession | undefined) => Promise<AppSession | undefined>
export const refresh: Refresh =
  (params) => (getCookie) => (setCookie) => async (currentAppSession) => {
    if (!currentAppSession) {
      console.log('passed undefined')
      return undefined
    }
    if (!shouldRefresh(currentAppSession)) {
      console.log('does not need refresh')
      return currentAppSession
    }

    console.log('should refresh')
    const newAppSession = await refreshAppSession(
      refreshAccessToken(fetch)(params),
    )(currentAppSession)

    if (!newAppSession) {
      console.log('refresh failed')
      // Refresh failed -> user becomes unauthenticated
      removeSession(params)(getCookie)(setCookie)(currentAppSession)
      return undefined
    }

    return putSession(params)(getCookie)(setCookie)(newAppSession)
  }
