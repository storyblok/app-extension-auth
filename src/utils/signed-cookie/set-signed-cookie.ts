import http from 'http'
import { setCookie } from '@src/utils/cookie/set-cookie'
import { signData } from '@src/utils/sign-verify/sign-data'

export const setSignedCookie =
  (secret: string) =>
  <Data>(name: string) =>
  (data: Data) =>
  (res: http.ServerResponse): void =>
    void setCookie(res, name, signData(secret)(data))
