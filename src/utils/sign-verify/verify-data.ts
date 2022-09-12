import jwt from 'jsonwebtoken'

export const verifyData =
  (jwtSecret: string) =>
  <Data>(jwtToken: string): Data | undefined => {
    try {
      const payload = jwt.verify(jwtToken, jwtSecret)
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
