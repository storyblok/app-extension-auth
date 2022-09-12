import http from 'http'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import makeSessionParser from 'grant/lib/session'
import { isStoryblokGrantCookie } from '@src/storyblok-auth-api/grant/StoryblokGrantCookie/isStoryblokGrantCookie'
import { StoryblokGrantSession } from '@src/storyblok-auth-api/grant/StoryblokGrantSession/StoryblokGrantSession'

type MakeSessionParser = (options: {
  // The cookie name
  name: string
  // JWT secret
  secret: string
}) => (request: http.IncomingMessage) => {
  get: () => unknown
}

export const getGrantSession = async (params: {
  // The cookie name
  cookieName: string
  // JWT secret
  jwtSecret: string
  request: http.IncomingMessage
}): Promise<StoryblokGrantSession | undefined> => {
  const grantCookieParser = (makeSessionParser as MakeSessionParser)({
    name: params.cookieName,
    secret: params.jwtSecret,
  })
  const cookie = await grantCookieParser(params.request).get()
  return isStoryblokGrantCookie(cookie) ? cookie.grant : undefined
}
