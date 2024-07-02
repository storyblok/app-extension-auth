import { expireCookie, getCookie, setCookie, verifyData } from '../utils'
import jwt from 'jsonwebtoken'
import { Adapter } from './generalAdapter'

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
    const cookieValue = cookieAdapter.getItem({ req, res, key })

    const isCallbackCookie = key === 'auth.sb.callback'
    const cookieWithAllSessions = {
      sessions: cookieValue ? [cookieValue, value] : [value],
    }

    const data = isCallbackCookie ? value : cookieWithAllSessions

    const signedData = jwt.sign({ data }, clientSecret)
    setCookie(res, key, signedData)
  },
  hasItem: ({ req, res, key }) =>
    cookieAdapter.getItem({ req, res, key }) !== undefined,
  removeItem: ({ res, key }) => {
    expireCookie(res, key)
  },
}

// { res, key } are not enough to retrieve data from database
