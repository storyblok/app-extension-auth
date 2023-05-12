import { AppSession, getAllSessions } from '../../../session'
import { GetCookie, signData } from '../../../utils'
import { appendQueryParams } from '../../../utils/query-params/append-query-params'
import { authCookieName } from '../../../session/authCookieName'
import {
  clearCallbackCookieElement,
  getCallbackCookieData,
} from '../callbackCookie'
import { CookieElement } from '../../ResponseElement'
import { AuthHandlerParams } from '../../AuthHandlerParams'
import { spaceIdFromUrl } from './spaceIdFromUrl'
import { HandleAuthRequest } from '../HandleAuthRequest'
import { fetchAppSession } from './fetchAppSession'

export type AppSessionQueryParams = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string
>

export const handleCallbackRequest: HandleAuthRequest<{
  params: AuthHandlerParams
  url: string
  getCookie: GetCookie
}> = async ({ params, url, getCookie }) => {
  try {
    const spaceId = spaceIdFromUrl(url)
    if (!spaceId) {
      return {
        type: 'error',
        message:
          'The callback URL is missing the following parameter: space_id',
      }
    }

    const callbackCookie = getCallbackCookieData(params.clientSecret, getCookie)
    if (!callbackCookie) {
      return {
        type: 'error',
        setCookies: [clearCallbackCookieElement],
        redirectTo: params.errorCallback,
      }
    }

    const { codeVerifier, state, returnTo } = callbackCookie
    const appSession = await fetchAppSession(params, {
      spaceId,
      codeVerifier,
      state,
      url,
    })
    if (!appSession) {
      return {
        type: 'error',
        setCookies: [clearCallbackCookieElement],
        redirectTo: params.errorCallback,
      }
    }

    const queryParams: AppSessionQueryParams = {
      spaceId: appSession.spaceId.toString(),
      userId: appSession.userId.toString(),
    }
    const redirectTo = appendQueryParams(returnTo, queryParams)

    const setSessions: CookieElement = {
      name: authCookieName(params),
      value: signData(params.clientSecret)({
        sessions: [...getAllSessions(params, getCookie), appSession],
      }),
    }

    return {
      type: 'success',
      redirectTo,
      setCookies: [clearCallbackCookieElement, setSessions],
    }
  } catch (e) {
    return {
      type: 'error',
      message: e instanceof Error ? e.message : 'An unknown error occurred',
      setCookies: [clearCallbackCookieElement],
      redirectTo: params.errorCallback,
    }
  }
}
