import { ServerResponse } from 'node:http'
import { verifyData } from '../../utils'
import jwt from 'jsonwebtoken'
import { type Adapter } from '../AuthHandlerParams'

const REGEXP_ESCAPE_CHARS_REGEXP = /[\^$\\.*+?()[\]{}|]/g

const getPattern = (name: string) =>
  new RegExp(
    '(?:^|;) *' + name.replace(REGEXP_ESCAPE_CHARS_REGEXP, '\\$&') + '=([^;]*)',
  )

const withCookie = (
  headers: string[],
  name: string,
  value: string,
): string[] => [
  ...headers.filter((header) => !header.startsWith(`${name}=`)),
  changedCookieHeaderValue(name, value),
]

const cookieHeaders = (res: ServerResponse): string[] => {
  const header = res.getHeader('Set-Cookie')
  if (typeof header === 'undefined') {
    return []
  }
  if (typeof header == 'number') {
    return [header.toString(10)]
  }
  if (typeof header == 'string') {
    return [header]
  }
  return header
}

const changedCookieHeaderValue = (name: string, value: string) =>
  `${name}=${value}; path=/; samesite=none; secure; httponly; partitioned;`

const expiredCookieHeaderValue = (name: string) =>
  `${name}=""; path=/; samesite=none; secure; httponly; expires=Thu, 01 Jan 1970 00:00:00 GMT; partitioned;`

const withExpiredCookie = (headers: string[], name: string): string[] => [
  ...headers.filter((header) => !header.startsWith(`${name}=`)),
  expiredCookieHeaderValue(name),
]

const clientSecret = process.env['CLIENT_SECRET'] || ''

export const cookieAdapter: Adapter = {
  getItem: ({ req, key }) => {
    const header = req.headers['cookie']

    if (!header) {
      return undefined
    }

    const match = header.match(getPattern(key))
    if (!match) {
      return undefined
    }

    const value = match[1]

    // TODO: verifyData correct typing
    if (value[0] === '"') {
      return verifyData(clientSecret)(value.slice(1, -1)) as object
    }
    return verifyData(clientSecret)(value) as object
  },
  setItem: ({ req, res, key, value }) => {
    const currentSession = cookieAdapter.getItem({ req, res, key })

    //Add session to array
    const data =
      key === 'sb.auth'
        ? {
            sessions: currentSession ? [currentSession, value] : [value],
          }
        : value

    const signedData = withCookie(
      cookieHeaders(res),
      key,
      jwt.sign({ data }, clientSecret),
    )
    res.setHeader('Set-Cookie', signedData)
  },
  hasItem: ({ req, res, key }) =>
    cookieAdapter.getItem({ req, res, key }) !== undefined,
  removeItem: ({ res, key }) => {
    res.setHeader('Set-Cookie', withExpiredCookie(cookieHeaders(res), key))
  },
}
