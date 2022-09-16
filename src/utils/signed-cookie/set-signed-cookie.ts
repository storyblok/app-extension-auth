import http from 'http'
import { setCookie } from '../cookie/set-cookie'
import { signData } from '../sign-verify/sign-data'

export const setSignedCookie =
  (secret: string) =>
  <Data>(name: string) =>
  (data: Data) =>
  (res: http.ServerResponse): void =>
    void setCookie(res, name, signData(secret)(data))
