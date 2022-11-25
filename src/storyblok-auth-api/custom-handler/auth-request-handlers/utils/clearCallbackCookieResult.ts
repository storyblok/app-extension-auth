import { callbackCookieName } from '../../callback-cookie'
import { HandleAuthRequestResultSetCookie } from '../types/HandleAuthRequestResult'

export const clearCallbackCookieResult: HandleAuthRequestResultSetCookie = {
  name: callbackCookieName,
  value: undefined,
}
