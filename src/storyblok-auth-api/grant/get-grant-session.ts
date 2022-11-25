import http from 'http'
import makeSessionParser from 'grant/lib/session'
import { StoryblokGrantSession } from './StoryblokGrantSession/StoryblokGrantSession'
import { isStoryblokGrantCookie } from './StoryblokGrantCookie/isStoryblokGrantCookie'
import { grantCookieName } from './grant-handler'

declare module 'grant/lib/session' {
  export function makeSessionParser(options: {
    // The cookie name
    name: string
    // JWT secret
    secret: string
  }): (request: http.IncomingMessage) => {
    get: () => unknown
  }
}

export const getGrantSession = async (params: {
  // JWT secret
  secret: string
  request: http.IncomingMessage
}): Promise<StoryblokGrantSession | undefined> => {
  const grantCookieParser = makeSessionParser({
    name: grantCookieName,
    secret: params.secret,
  })
  const cookie = await grantCookieParser(params.request).get()
  return isStoryblokGrantCookie(cookie) ? cookie.grant : undefined
}
