import http from 'http'
import { signData } from '../sign-verify/sign-data'
import { setCookie } from '../cookie'

export const setSignedCookie =
  (secret: string) =>
  <Data>(name: string) =>
  (data: Data) =>
  (res: http.ServerResponse): void =>
    void setCookie(res, name, signData(secret)(data))
