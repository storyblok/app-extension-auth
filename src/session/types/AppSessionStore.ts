import { AppSessionQuery } from '@src/session/types/AppSessionKeys'
import { AppSession } from '@src/session/types/AppSession'

export type AppSessionStore = {
  get: (
    keys: AppSessionQuery,
    options?: {
      autoRefresh?: boolean
    },
  ) => Promise<AppSession | undefined>
  getAll: () => Promise<AppSession[]>
  put: (session: AppSession) => Promise<AppSession | undefined>
  remove: (keys: AppSessionQuery) => Promise<AppSession | undefined>
}
