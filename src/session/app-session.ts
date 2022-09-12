export type AppSessionKeys = Pick<AppSession, 'spaceId' | 'userId'>
export type AppSessionQueryParams = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string
>
export type AppSessionQuery = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string | number
>

export type AppSession = {
  // sessionId: string // TODO, do we need this? Before reading from db, must know if user is authorized
  spaceId: number // primary key
  userId: number // primary key
  appClientId: string // primary key
  userName: string
  spaceName: string
  roles: string[]
  expiresAt: number
  refreshToken: string
  accessToken: string
}

// TODO decide whether to use this schema instead?
//  Drawback: AppSession won't inherit from AppSessionQuery
// export type AppSession = {
//     appClientId: string // primary key
//     expiresAt: number
//     refreshToken: string
//     accessToken: string
// } & UserInfo
