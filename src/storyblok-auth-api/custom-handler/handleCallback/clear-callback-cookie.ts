import { HandleAuthRequestResultSetCookie } from '../HandleAuthRequest/HandleAuthRequestResult'
import { callbackCookieName } from '../callback-cookie'

export const clearCallbackCookie: HandleAuthRequestResultSetCookie = {
  name: callbackCookieName,
  value: undefined,
}
