import { AuthHandlerParams } from '../../storyblok-auth-api'
import { AppSessionStore } from './AppSessionStore'
import { GetCookie, SetCookie } from '../../types/cookie'

export type CreateAppSessionCookieStoreParams = Pick<
  AuthHandlerParams,
  'clientId' | 'cookieName' | 'clientSecret' | 'baseUrl' | 'endpointPrefix'
> & {
  setCookie: SetCookie
  getCookie: GetCookie
}

export type CreateSessionCookieStore = (
  params: CreateAppSessionCookieStoreParams,
) => AppSessionStore
