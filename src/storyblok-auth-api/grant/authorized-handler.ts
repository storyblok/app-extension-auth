import http from 'http'
import { grantCookieName } from './grant-handler'
import { sessionCookieStore } from '../../session/sessionCookieStore'
import { expireCookie } from '../../utils'
import { getGrantSession } from './get-grant-session'
import { AppSession } from '../../session'
import { appendQueryParams } from '../../utils/query-params/append-query-params'
import { AuthHandlerParams } from '../AuthHandlerParams'

type AppSessionQueryParams = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string
>

export type GrantCallbackHandlerParams = Pick<
  AuthHandlerParams,
  | 'successCallback'
  | 'errorCallback'
  | 'cookieName'
  | 'clientId'
  | 'clientSecret'
  | 'baseUrl'
  | 'endpointPrefix'
>

const makeEndWithError =
  (response: http.ServerResponse, redirectTo: string | undefined) =>
  (message?: string) => {
    if (message) {
      console.debug(message)
    }

    if (redirectTo) {
      response
        .writeHead(302, {
          Location: redirectTo,
        })
        .end()
    } else {
      response.writeHead(401).end()
    }
  }

export const authorizedHandler =
  (params: GrantCallbackHandlerParams) =>
  async (
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ): Promise<void> => {
    const endWithError = makeEndWithError(response, params.errorCallback)
    try {
      const grantCookie = await getGrantSession({
        secret: params.clientSecret,
        request,
      })

      if (typeof grantCookie === 'undefined') {
        endWithError('Authentication failed: no grant session is present')
        return
      }

      const grantResponse = grantCookie.response

      const appSession: AppSession = {
        refreshToken: grantResponse.refresh_token,
        accessToken: grantResponse.access_token,
        userId: grantResponse.profile.user.id,
        userName: grantResponse.profile.user.friendly_name,
        spaceId: grantResponse.profile.space.id,
        spaceName: grantResponse.profile.space.name,
        appClientId: params.clientId,
        roles: grantResponse.profile.roles.map((role) => role.name),
        expiresAt:
          Date.now() + (grantResponse.raw.expires_in ?? 60 * 10) * 1000,
      }

      const queryParams: AppSessionQueryParams = {
        spaceId: appSession.spaceId.toString(),
        userId: appSession.userId.toString(),
      }

      const redirectTo = appendQueryParams(
        params?.successCallback ?? '/',
        queryParams,
      )

      const appSessions = sessionCookieStore(params)({
        req: request,
        res: response,
      })
      await appSessions.put(appSession)

      // Cleanup the cookie that was set by grant during the oauth flow
      expireCookie(response, grantCookieName)

      response
        .writeHead(302, {
          Location: redirectTo.toString(),
        })
        .end()
    } catch (e) {
      endWithError()
    }
  }
