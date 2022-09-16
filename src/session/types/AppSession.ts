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
