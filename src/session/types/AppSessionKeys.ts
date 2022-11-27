import { AppSession } from './AppSession'

// TODO shouldn't client id be included here?
export type AppSessionKeys = Pick<AppSession, 'spaceId' | 'userId'>

/**
 * Query for uniqely specifying an AppSession
 */
export type AppSessionQuery = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string | number
>
