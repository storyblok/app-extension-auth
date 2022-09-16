import { simpleSessionCookieStore } from './app-session-cookie-store'
import { shouldRefresh } from './shouldRefresh/shouldRefresh'
import { refreshAppSession } from './refreshAppSession/refreshAppSession'
import { refreshToken } from '../storyblok-auth-api/refreshToken'
import { AppSessionCookieStoreFactory } from './types'
import { AppSessionStore } from './types'

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
