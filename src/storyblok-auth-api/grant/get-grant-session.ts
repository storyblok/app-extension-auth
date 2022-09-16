import http from 'http'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import makeSessionParser from 'grant/lib/session'
import { StoryblokGrantSession } from './StoryblokGrantSession/StoryblokGrantSession'
import { isStoryblokGrantCookie } from './StoryblokGrantCookie/isStoryblokGrantCookie'
import { grantCookieName } from './grant-handler'

type MakeSessionParser = (options: {
  // The cookie name
  name: string
  // JWT secret
  secret: string
}) => (request: http.IncomingMessage) => {
  get: () => unknown
}

export const getGrantSession = async (params: {
  // JWT secret
  secret: string
  request: http.IncomingMessage
}): Promise<StoryblokGrantSession | undefined> => {
  const grantCookieParser = (makeSessionParser as MakeSessionParser)({
    name: grantCookieName,
    secret: params.secret,
  })
  const cookie = await grantCookieParser(params.request).get()
  return isStoryblokGrantCookie(cookie) ? cookie.grant : undefined
}
