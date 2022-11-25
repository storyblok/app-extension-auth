import { verifyData } from '../sign-verify/verify-data'
import { GetCookie } from '../../types/cookie'

export const getSignedCookie =
  (secret: string) => (getCookie: GetCookie) => (name: string) => {
    const jwtToken = getCookie(name)
    if (!jwtToken) {
      return undefined
    }
    return verifyData(secret)(jwtToken)
  }
