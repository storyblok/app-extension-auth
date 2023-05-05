import http from 'http'
import { signData } from '../../signData'
import { setCookie } from '../setCookie'

export const setSignedCookie =
  (secret: string) =>
  <Data>(name: string) =>
  (data: Data) =>
  (res: http.ServerResponse): void =>
    void setCookie(res, name, signData(secret)(data))
