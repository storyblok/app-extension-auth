import { AppSession } from '../../types'

export type AppSessionCookiePayload =
  | {
      sessions: AppSession[]
    }
  | undefined
