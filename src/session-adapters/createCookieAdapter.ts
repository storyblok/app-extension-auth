import { expireCookie, getCookie, setCookie, verifyData } from '../utils'
import jwt from 'jsonwebtoken'
import { Adapter } from './publicAdapter'
import { isAppSession } from '../session'

const clientSecret = process.env['CLIENT_SECRET'] || ''
const defaultSessionKey = 'sb.auth'

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

type CreateCookieAdapter = (params?: {
  sessionKey?: string | undefined
}) => Adapter

export const createCookieAdapter: CreateCookieAdapter = (params) => {
  const key = params?.sessionKey ?? defaultSessionKey

  const adapter: Adapter = {
    getSession: ({ req, spaceId, userId }) => {
      const cookie = getCookie(req, createScopedKey({ spaceId, userId, key }))

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
      const expires = createExpirationDate(7)

      const signedData = jwt.sign({ data: session }, clientSecret)

      setCookie(
        res,
        createScopedKey({ spaceId, userId, key }),
        signedData,
        expires,
      )
      return true
    },

    hasSession: (params) => {
      const session = adapter.getSession(params)
      return session !== undefined
    },

    removeSession: ({ res, spaceId, userId }) => {
      expireCookie(res, createScopedKey({ spaceId, userId, key }))
      return true
    },
  }

  return adapter
}

//TODO: extract to util
const createExpirationDate = (days: number): Date => {
  const expires = new Date()
  expires.setDate(expires.getDate() + days)
  return expires
}
