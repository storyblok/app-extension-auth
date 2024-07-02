import { AppSession } from '../../../session'
import { appendQueryParams } from '../../../utils/query-params/append-query-params'
import { sessionIdentifier } from '../../../session/sessionIdentifier'
import {
  CallbackCookieData,
  callbackCookieName,
  clearCallbackData,
} from '../callbackCookie'
import { SessionElement } from '../../ResponseElement'
import { AuthHandlerParams } from '../../AuthHandlerParams'
import { regionFromUrl } from './spaceIdFromUrl'
import { HandleAuthRequest } from '../HandleAuthRequest'
import { fetchAppSession } from './fetchAppSession'
import { InternalAdapter } from '../../../session-adapters/internalAdapter'

export type AppSessionQueryParams = Record<
  keyof Pick<AppSession, 'spaceId' | 'userId'>,
  string
>

export const handleCallbackRequest: HandleAuthRequest<{
  params: AuthHandlerParams
  url: string
  adapter: InternalAdapter
}> = async ({ params, url, adapter }) => {
  try {
    const region = regionFromUrl(url)
    if (!region) {
      return {
        type: 'error',
        message: `The space_id in the callback URL cannot be mapped to a region. URL: ${url}`,
      }
    }

    // //TODO: fix typing
    const callbackData = (await adapter.getItem(
      callbackCookieName,
    )) as CallbackCookieData

    if (!callbackData) {
      return {
        type: 'error',
        sessions: [clearCallbackData],
        redirectTo: params.errorCallback,
      }
    }

    const { codeVerifier, state, returnTo } = callbackData
    const appSession = await fetchAppSession(params, {
      region,
      codeVerifier,
      state,
      url,
    })

    if (!appSession) {
      return {
        type: 'error',
        sessions: [clearCallbackData],
        redirectTo: params.errorCallback,
      }
    }

    const queryParams: AppSessionQueryParams = {
      spaceId: appSession.spaceId.toString(),
      userId: appSession.userId.toString(),
    }
    const redirectTo = appendQueryParams(returnTo, queryParams)

    const setSession: SessionElement = {
      name: sessionIdentifier(params),
      value: appSession,
    }

    return {
      type: 'success',
      redirectTo,
      sessions: [clearCallbackData, setSession],
    }
  } catch (e) {
    return {
      type: 'error',
      message: e instanceof Error ? e.message : 'An unknown error occurred',
      sessions: [clearCallbackData],
      redirectTo: params.errorCallback,
    }
  }
}
