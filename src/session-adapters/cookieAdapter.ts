import { expireCookie, getCookie, setCookie, verifyData } from '../utils'
import jwt from 'jsonwebtoken'
import { Adapter } from './publicAdapter'

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
export const cookieAdapter: Adapter = {
  getItem: ({ req, spaceId, userId, key }) => {
    const cookie = getCookie(req, createScopedKey({ spaceId, userId, key }))

    if (!cookie) {
      return undefined
    }

    const verifiedData = verifyData(clientSecret)(cookie)
    if (!verifiedData) {
      return undefined
    } else {
      return verifiedData as string
    }
  },

  setItem: ({ res, spaceId, userId, key, value }) => {
    const signedData = jwt.sign({ data: value }, clientSecret)
    setCookie(res, createScopedKey({ spaceId, userId, key }), signedData)
    return true
  },

  hasItem: async (params) =>
    (await cookieAdapter.getItem(params)) !== undefined,

  removeItem: ({ res, spaceId, userId, key }) => {
    expireCookie(res, createScopedKey({ spaceId, userId, key }))
    return true
  },
}
