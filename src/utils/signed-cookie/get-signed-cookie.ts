import http from 'http'
import { getCookie } from '@src/utils/cookie/get-cookie'
import { verifyData } from '@src/utils/sign-verify/verify-data'

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
