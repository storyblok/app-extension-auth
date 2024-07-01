import { expireCookie, getCookie, setCookie, verifyData } from '../utils'
import jwt from 'jsonwebtoken'
import { type Adapter } from '../storyblok-auth-api/AuthHandlerParams'

const clientSecret = process.env['CLIENT_SECRET'] || ''

export const cookieAdapter: Adapter = {
  getItem: ({ req, key }) => {
    const cookie = getCookie(req, key)

    if (!cookie) {
      return undefined
    }

    //TODO: fix typing
    return verifyData(clientSecret)(cookie) as object
  },
  setItem: ({ req, res, key, value }) => {
    const currentSession = cookieAdapter.getItem({ req, res, key })

    // TODO: Improve readability
    // TODO: improve checking as user might select their own key and not sb.auth
    const isSession = key === 'sb.auth'
    const data = isSession
      ? {
          sessions: currentSession ? [currentSession, value] : [value],
        }
      : value

    const signedData = jwt.sign({ data }, clientSecret)
    setCookie(res, key, signedData)
  },
  hasItem: ({ req, res, key }) =>
    cookieAdapter.getItem({ req, res, key }) !== undefined,
  removeItem: ({ res, key }) => {
    expireCookie(res, key)
  },
}
