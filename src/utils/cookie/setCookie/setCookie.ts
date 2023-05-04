import http from 'http'
import { setCookieValue } from '../setCookieValue'
import { expiredCookieValue } from '../expiredCookieValue'

/**
 * Returns all SetCookie headers as an array from a http.ServerResponse.
 * @param res
 */
const cookieHeaders = (res: http.ServerResponse): string[] => {
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

const withCookie = (
  headers: string[],
  name: string,
  value: string,
): string[] => [
  ...headers.filter((header) => !header.startsWith(`${name}=`)),
  setCookieValue(name, value),
]

const withExpiredCookie = (headers: string[], name: string): string[] => [
  ...headers.filter((header) => !header.startsWith(`${name}=`)),
  expiredCookieValue(name),
]

export const setCookie = (
  res: http.ServerResponse,
  name: string,
  value: string,
): void =>
  void res.setHeader('Set-Cookie', withCookie(cookieHeaders(res), name, value))

export const expireCookie = (res: http.ServerResponse, name: string) =>
  void res.setHeader('Set-Cookie', withExpiredCookie(cookieHeaders(res), name))
