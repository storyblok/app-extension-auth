export type HandleAuthRequestResultSetCookie = {
  name: string
  value: string | undefined
}
export type HandleAuthRequestResult = {
  type: 'success' | 'error' | 'configuration-error'
  setCookies?: HandleAuthRequestResultSetCookie[]
  redirectTo?: string
  message?: string
}
