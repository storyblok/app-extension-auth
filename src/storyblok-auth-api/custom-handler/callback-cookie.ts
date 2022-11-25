import { GetCookie, SetCookie } from '../../types/cookie'
import { setSignedCookie } from '../../utils/signed-cookie/set-signed-cookie'
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

export const setCallbackCookie =
  (secret: string) => (setCookie: SetCookie) => (payload: CallbackCookie) =>
    setSignedCookie(secret)(setCookie)(callbackCookieName)(payload)

// TODO validate
export const getCallbackCookie =
  (secret: string) =>
  (getCookie: GetCookie): CallbackCookie | undefined =>
    getSignedCookie(secret)(getCookie)(
      callbackCookieName,
    ) as unknown as CallbackCookie
