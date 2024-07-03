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

    const verifiedData = verifyData(clientSecret)(cookie)
    if (!verifiedData) {
      return undefined
    } else {
      return verifiedData as string
    }
  },

  setItem: ({ res, key, value }) => {
    const signedData = jwt.sign({ data: value }, clientSecret)
    setCookie(res, key, signedData)
    return true
  },

  hasItem: async (params) =>
    (await cookieAdapter.getItem(params)) !== undefined,

  removeItem: ({ res, key }) => {
    expireCookie(res, key)
    return true
  },
}
