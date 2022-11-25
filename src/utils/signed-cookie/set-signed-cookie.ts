import { signData } from '../sign-verify/sign-data'
import { SetCookie } from '../../types/cookie'

export const setSignedCookie =
  (secret: string) =>
  (setCookie: SetCookie) =>
  (name: string) =>
  (data: unknown) =>
    void setCookie(name, signData(secret)(data))
