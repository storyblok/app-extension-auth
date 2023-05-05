import http from 'http'
import { getCookie } from '../getCookie'
import { verifyData } from '../../verifyData'

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
