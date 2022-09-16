import { AppSessionStore } from '@src/session/types/AppSessionStore'
import { AuthHandlerParams } from '@src/storyblok-auth-api'
import http from 'http'

export type AppSessionCookieStoreFactoryParams = Pick<
  AuthHandlerParams,
  'clientId' | 'cookieName' | 'clientSecret'
>
export type AppSessionCookieStoreFactory = (
  staticParams: AppSessionCookieStoreFactoryParams,
) => (requestParams: {
  req: http.IncomingMessage
  res: http.ServerResponse
}) => AppSessionStore
