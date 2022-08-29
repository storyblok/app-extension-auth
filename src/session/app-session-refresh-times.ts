import {AppSession} from "@src/session/app-session";

export const shouldRefresh = (session: AppSession): boolean => (
    serverRefreshIn(session) < 0
)

export const serverRefreshIn = (session: AppSession): number => (
    expiresIn(session) - 60 * 1000
)

export const expiresIn = (session: AppSession): number => (
    session.expiresAt - Date.now()
)