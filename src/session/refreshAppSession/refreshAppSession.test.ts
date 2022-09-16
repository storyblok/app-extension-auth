import { refreshAppSession, RefreshToken } from './refreshAppSession'
import { AppSession } from '../types/AppSession'

const validRefreshToken = 'abc123abc123'
const invalidRefreshToken = 'oo0o0o0o0o0o0o0o0oo'
const refresh: RefreshToken = async (refreshToken) =>
  refreshToken === validRefreshToken
    ? {
        access_token: 'new-access-token',
        expires_in: 899, // seconds
      }
    : undefined

const oldValidSession: AppSession = {
  refreshToken: validRefreshToken,
  userId: 123,
  expiresAt: 123,
  spaceName: 'My Space',
  spaceId: 123,
  roles: ['admin'],
  appClientId: '123',
  userName: 'Johannes',
  accessToken: 'old-token',
}

const invalidSession: AppSession = {
  refreshToken: invalidRefreshToken,
  userId: 123,
  expiresAt: 123,
  spaceName: 'My Space',
  spaceId: 123,
  roles: ['admin'],
  appClientId: '123',
  userName: 'Johannes',
  accessToken: 'old-token',
}

describe('refreshAppSession', () => {
  it('should refresh the token', async () => {
    const value = await refreshAppSession(refresh)(oldValidSession)
    expect(value).toBeDefined()
  })
  it('should return undefined if the refresh fails refreshTokens', async () => {
    const value = await refreshAppSession(refresh)(invalidSession)
    expect(value).toBeUndefined()
  })
})
