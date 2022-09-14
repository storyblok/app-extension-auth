import jwt from 'jsonwebtoken'

export const verifyData =
  (secret: string) =>
  <Data>(jwtToken: string): Data | undefined => {
    try {
      const payload = jwt.verify(jwtToken, secret)
      if (typeof payload === 'string') {
        return undefined
      }
      if (!('data' in payload)) {
        return undefined
      }
      return payload.data as Data
    } catch (e) {
      return undefined
    }
  }
