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
