import http from 'http'
import { verifyData } from '../sign-verify/verify-data'
import { getCookie } from '../cookie'

export const getSignedCookie =
  (secret: string) =>
  <Data>(name: string) =>
  (req: http.IncomingMessage): Data | undefined => {
    const jwtToken = getCookie(req, name)
    if (!jwtToken) {
      return undefined
    }
    return verifyData(secret)(jwtToken)
  }
