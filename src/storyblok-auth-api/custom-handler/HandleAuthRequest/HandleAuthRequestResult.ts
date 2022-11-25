export type HandleAuthRequestResultSetCookie = {
  name: string
  value: string | undefined
}
export type HandleAuthRequestResult = {
  type: 'success' | 'error'
  setCookies: HandleAuthRequestResultSetCookie[]
  redirectTo?: string
}
