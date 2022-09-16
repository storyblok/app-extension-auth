import { AppSession } from '../types'

/**
 * Whether the server should refresh the token, while keeping some margin.
 * @param session
 */
export const shouldRefresh = (session: AppSession): boolean =>
  serverRefreshIn(session) < 0

/**
 * How many milliseconds until the server should refresh the token, while keeping some margin.
 * @param session
 */
const serverRefreshIn = (session: AppSession): number =>
  expiresIn(session) - 60 * 1000

/**
 * When the token will expire
 * @param session
 */
const expiresIn = (session: AppSession): number =>
  session.expiresAt - Date.now()
