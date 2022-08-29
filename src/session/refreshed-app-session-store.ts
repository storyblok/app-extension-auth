import {
    AppSessionCookieStoreFactory,
    simpleSessionCookieStore
} from "@src/session/app-session-cookie-store";
import {shouldRefresh} from "@src/session/app-session-refresh-times";
import {refreshAppSession} from "@src/session/refresh-app-session";

export const sessionCookieStore: AppSessionCookieStoreFactory =
    (params) =>
        (requestParams) => {
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
                        const newSession = await refreshAppSession(params)(currentSession)

                        if (!newSession) {
                            // Refresh failed -> user becomes unauthenticated
                            await store.remove(currentSession)
                            return undefined
                        }

                        await store.put(newSession)
                        return newSession
                    }
                    return currentSession
                }
            }
        }