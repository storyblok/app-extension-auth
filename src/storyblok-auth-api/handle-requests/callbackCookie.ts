import { signData } from '../../utils'
import { SessionElement } from '../ResponseElement'

/**
 * The payload of the cookie that preserves the state between the calls to `/signin` and `/callback`
 */
export type CallbackCookieData = {
  // The address that the app should redirect to after a successful authentication
  returnTo: string
  // OAuth 2.0 code_verifier
  codeVerifier: string
  // OAuth 2.0 state
  state: string
}

/**
 * A cookie with this name is set before signing in, and consumed by the callback function
 */
const callbackCookieName = 'auth.sb.callback'

export const createCallbackData = (
  secret: string,
  data: CallbackCookieData,
) => ({
  name: callbackCookieName,
  value: signData(secret)(data),
})

export const clearCallbackData: SessionElement = {
  name: callbackCookieName,
  value: undefined,
}
