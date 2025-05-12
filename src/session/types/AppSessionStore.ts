import { AppSessionQuery } from './AppSessionKeys'
import { AppSession } from './AppSession'

export type AppSessionStore = {
  get: (
    keys: AppSessionQuery,
    options?: {
      autoRefresh?: boolean
    },
  ) => Promise<AppSession | undefined>
  getAll: (keys: AppSessionQuery) => Promise<AppSession[] | undefined>
  put: (session: AppSession) => Promise<boolean>
  remove: (keys: AppSessionQuery) => Promise<boolean>
}
