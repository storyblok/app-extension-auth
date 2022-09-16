import { simpleSessionCookieStore } from '@src/session/app-session-cookie-store'
import { shouldRefresh } from '@src/session/shouldRefresh/shouldRefresh'
import { refreshAppSession } from '@src/session/refreshAppSession/refreshAppSession'
import { refreshToken } from '@src/storyblok-auth-api/refreshToken'
import { AppSessionCookieStoreFactory } from '@src/session/types/AppSessionCookieStoreFactory'
import { AppSessionStore } from '@src/session/types/AppSessionStore'

export const sessionCookieStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const store = simpleSessionCookieStore(params)(requestParams)
    return {
      ...store,
      get: async (keys, options) => {
        const currentSession = await store.get(keys)
        if (options?.autoRefresh === false) {
          return currentSession
        }
        if (!currentSession) {
          return undefined
        }
        if (shouldRefresh(currentSession)) {
          const newSession = await refreshAppSession(refreshToken(params))(
            currentSession,
          )

          if (!newSession) {
            // Refresh failed -> user becomes unauthenticated
            await store.remove(currentSession)
            return undefined
          }

          await store.put(newSession)
          return newSession
        }
        return currentSession
      },
    }
  }
