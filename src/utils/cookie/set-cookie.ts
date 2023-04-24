import http from 'http'

const getHeaders = (res: http.ServerResponse): string[] => {
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

const secondsInOneMonth = 60 * 60 * 24 * 32

const setCookieHeaderValue = (name: string, value: string) =>
  `${name}=${value}; path=/; samesite=none; secure; httponly; Max-Age=${secondsInOneMonth}`

const expiredCookieHeaderValue = (name: string) =>
  `${name}=""; path=/; samesite=none; secure; httponly; Max-Age=-1`

// const setCookieHeaderValue = (name: string, value: string) =>
//   `${name}=${value}; path=/; samesite=none; secure; httponly`
//
// const expiredCookieHeaderValue = (name: string) =>
//   `${name}=""; path=/; samesite=none; secure; httponly; expires=Thu, 01 Jan 1970 00:00:00 GMT`

const withSetCookie = (
  headers: string[],
  name: string,
  value: string,
): string[] => [
  ...headers.filter((header) => !header.startsWith(`${name}=`)),
  setCookieHeaderValue(name, value),
]

const withExpiredCookie = (headers: string[], name: string): string[] => [
  ...headers.filter((header) => !header.startsWith(`${name}=`)),
  expiredCookieHeaderValue(name),
]

export const setCookie = (
  res: http.ServerResponse,
  name: string,
  value: string,
): void =>
  void res.setHeader('Set-Cookie', withSetCookie(getHeaders(res), name, value))

export const expireCookie = (res: http.ServerResponse, name: string) =>
  void res.setHeader('Set-Cookie', withExpiredCookie(getHeaders(res), name))
