import {AppSessionStore} from "@src/session/app-session-store";
import {makeJwtCookieStore} from "@src/utils/jwt-cookie-store";
import {AppSession, AppSessionKeys, AppSessionQuery} from "@src/session/app-session";
import {RequestParams} from "@src/session/request-params";
import {AppParams} from "@src/storyblok-auth-api/params/app-params";

export type AppSessionCookieStoreFactory = (staticParams: CookieParams & AppParams) =>
    (requestParams: RequestParams) => AppSessionStore

export type CookieParams = {
    jwtSecret: string
    // The name of the cookie that will be issued by this api endpoint handler
    cookieName: string
}

const toKeys = (keys: AppSessionQuery): AppSessionKeys => {
    const {spaceId, userId} = keys
    return ({
        spaceId: typeof spaceId === 'number' ? spaceId : parseInt(spaceId, 10),
        userId: typeof userId === 'number' ? userId : parseInt(userId, 10),
    })
}

export const isAppSessionQuery = (obj: unknown): obj is AppSessionQuery => {
    if (!(
        typeof obj === 'object' && obj !== null && 'userId' in obj && 'spaceId' in obj
    )) {
        return false
    }
    const r = obj as Record<string, unknown>
    return (
        typeof r.userId === 'string' ||
        typeof r.userId === 'number'
    ) && (
        typeof r.spaceId === 'string' ||
        typeof r.spaceId === 'number'
    )
}
type AppSessionCookiePayload = {
    sessions: AppSession[]
}

export const simpleSessionCookieStore: AppSessionCookieStoreFactory =
    (params) =>
        (requestParams) => {
            const {cookieName, appClientId} = params
            const jwtCookieStore = makeJwtCookieStore<AppSessionCookiePayload>({
                jwtSecret: params.jwtSecret,
                ...requestParams
            })
            const getPayload = () => (jwtCookieStore.get(cookieName) as AppSessionCookiePayload | undefined)
            const getSessions = () => (getPayload() ?? {sessions: []}).sessions
            return {
                get: async (params) => (
                    getSessions().find(matches({...toKeys(params), appClientId}))
                ),
                getAll: async () => (
                    getSessions().filter(session => (
                        session.appClientId === appClientId
                    ))
                ),
                put: async (session) => {
                    const filter = matches(session)
                    const otherSessions = getSessions().filter(s => !filter(s))
                    const allSessions = [
                        ...otherSessions,
                        session,
                    ]
                    jwtCookieStore.set(cookieName, {sessions: allSessions})
                    return session
                },
                remove: async (params) => {
                    const sessions = getSessions()
                    const toRemove = sessions.find(matches({...toKeys(params), appClientId}))
                    const allOther = sessions.filter(s => s !== toRemove)
                    jwtCookieStore.set(cookieName, {sessions: allOther})
                    return toRemove
                }
            }
        }

const matches = (a: AppSessionKeys & { appClientId: string }) => (b: AppSessionKeys & { appClientId: string }) => (
    a.appClientId === b.appClientId &&
    a.spaceId === b.spaceId &&
    a.userId === b.userId
)