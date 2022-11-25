import { createOpenidClient } from '../../openidClient'
import { getCallbackCookie } from '../../callback-cookie'
import { AppSession, createSessionCookieStore } from '../../../../session'
import { isUserInfo } from '../../../user-info/UserInfo/isUserInfo'
import { appendQueryParams } from '../../../../utils/query-params/append-query-params'
import { redirectUri } from '../../redirectUri'
import { isTokenSet } from './isTokenSet'
import { HandleAuthRequest } from '../utils/HandleAuthRequest'
import { signData } from '../../../../utils/sign-verify/sign-data'
import { clearCallbackCookieResult } from '../utils/clearCallbackCookieResult'
import { authCookieName } from '../../../../session/app-session-cookie-store'
import { HandleAuthRequestResultSetCookie } from '../types/HandleAuthRequestResult'

export type AppSessionQueryParams = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string
>

export const handleCallback =
  (url: string): HandleAuthRequest =>
  async (params) => {
    try {
      const callbackCookie = getCallbackCookie(params.clientSecret)(
        params.getCookie,
      )
      if (!callbackCookie) {
        return {
          type: 'error',
          setCookies: [clearCallbackCookieResult],
          redirectTo: params.errorCallback,
        }
      }

      // TODO use returnTo
      const { codeVerifier, state, returnTo } = callbackCookie
      const callbackParams = createOpenidClient(params).callbackParams(url)

      const tokenSet = await createOpenidClient(params).oauthCallback(
        redirectUri(params),
        callbackParams,
        {
          code_verifier: codeVerifier,
          state,
        },
      )
      if (!isTokenSet(tokenSet)) {
        return {
          type: 'error',
          setCookies: [clearCallbackCookieResult],
          redirectTo: params.errorCallback,
        }
      }
      // Storyblok do not conform to openid, so the userinfo object is not the same as in the openid specification:
      //  https://openid.net/specs/openid-connect-core-1_0.html#UserInfo
      const userInfo = await createOpenidClient(params).userinfo(
        tokenSet.access_token,
      )
      if (!isUserInfo(userInfo)) {
        return {
          type: 'error',
          setCookies: [clearCallbackCookieResult],
          redirectTo: params.errorCallback,
        }
      }
      console.log('valid user')
      const appSession: AppSession = {
        refreshToken: tokenSet.refresh_token,
        accessToken: tokenSet.access_token,
        expiresAt: Date.now() + tokenSet.expires_in * 1000,
        appClientId: params.clientId,
        roles: userInfo.roles.map((role) => role.name),
        spaceId: userInfo.space.id,
        spaceName: userInfo.space.name,
        userId: userInfo.user.id,
        userName: userInfo.user.friendly_name,
      }

      const queryParams: AppSessionQueryParams = {
        spaceId: appSession.spaceId.toString(),
        userId: appSession.userId.toString(),
      }
      const redirectTo = appendQueryParams(returnTo, queryParams)

      const appSessions = createSessionCookieStore(params)
      const existingSessions = await appSessions.getAll()
      const setSessions: HandleAuthRequestResultSetCookie = {
        name: authCookieName(params),
        value: signData(params.clientSecret)({
          sessions: [appSession, ...existingSessions],
        }),
      }

      return {
        type: 'success',
        redirectTo,
        setCookies: [clearCallbackCookieResult, setSessions],
      }
    } catch (e) {
      return {
        type: 'error',
        setCookies: [clearCallbackCookieResult],
        redirectTo: params.errorCallback,
      }
    }
  }
