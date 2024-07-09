import { expireCookie, getCookie, setCookie, verifyData } from '../utils'
import jwt from 'jsonwebtoken'
import { Adapter } from './publicAdapter'
import { isAppSession } from '../session'

const clientSecret = process.env['CLIENT_SECRET'] || ''

const createScopedKey = ({
  spaceId,
  userId,
  key,
}: {
  spaceId: string
  userId: string
  key: string
}) => {
  return `${spaceId}:${userId}:${key}`
}

// We do not use `clientId` in cookie adapter,
// because different plugins will have different domain names,
// and it's enough to differentiate these cookie values.

const sessionKey = 'sb.auth'
//NOTE: possibly cookieAdapter can become createCookieAdapter(key: string)

export const cookieAdapter: Adapter = {
  getSession: ({ req, spaceId, userId }) => {
    const cookie = getCookie(
      req,
      createScopedKey({ spaceId, userId, key: sessionKey }),
    )

    if (!cookie) {
      return undefined
    }

    const verifiedData = verifyData(clientSecret, cookie)

    if (!isAppSession(verifiedData)) {
      return undefined
    }

    return verifiedData
  },

  setSession: ({ res, spaceId, userId, session }) => {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)

    const signedData = jwt.sign({ data: session }, clientSecret)
    setCookie(
      res,
      createScopedKey({ spaceId, userId, key: sessionKey }),
      signedData,
      expires,
    )
    return true
  },

  hasSession: async (params) =>
    (await cookieAdapter.getSession(params)) !== undefined,

  removeSession: ({ res, spaceId, userId }) => {
    expireCookie(res, createScopedKey({ spaceId, userId, key: sessionKey }))
    return true
  },
}
