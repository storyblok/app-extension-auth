import { GetCookie } from '../../types/cookie'
import { getSignedCookie } from '../../utils/signed-cookie/get-signed-cookie'

/**
 * This cookie is set before signing in, and consumed by the callback function
 */

export const callbackCookieName = 'auth.sb.callback'

type CallbackCookie = {
  returnTo: string
  codeVerifier: string
  state: string
}

// TODO validate
export const getCallbackCookie =
  (secret: string) =>
  (getCookie: GetCookie): CallbackCookie | undefined =>
    getSignedCookie(secret)(getCookie)(
      callbackCookieName,
    ) as unknown as CallbackCookie
