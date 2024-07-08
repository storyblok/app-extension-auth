import http from 'http'
import { Adapter, MaybePromise } from './publicAdapter'
import {
  CallbackCookieData,
  callbackCookieName,
} from '../storyblok-auth-api/handle-requests/callbackCookie'
import {
  expireCookie,
  getCookie,
  setCookie,
  signData,
  verifyData,
} from '../utils'
import { AppSession } from '../session/types'
import { AuthHandlerParams } from '../storyblok-auth-api'

export type InternalAdapter = {
  // session
  getSession: (params: {
    spaceId: string
    userId: string
  }) => MaybePromise<AppSession | undefined>

  setSession: (params: {
    spaceId: string
    userId: string
    session: AppSession
  }) => MaybePromise<boolean>

  removeSession: (params: {
    spaceId: string
    userId: string
  }) => MaybePromise<boolean>

  hasSession: (params: {
    spaceId: string
    userId: string
  }) => MaybePromise<boolean>

  // callback data
  setCallbackData: (data: CallbackCookieData) => MaybePromise<boolean>

  getCallbackData: () => MaybePromise<CallbackCookieData | undefined>

  removeCallbackData: () => MaybePromise<boolean>
}

type CreateInternalAdapter = ({
  params,
  req,
  res,
  adapter,
}: {
  params: Pick<AuthHandlerParams, 'clientId' | 'clientSecret'>
  req: http.IncomingMessage
  res: http.ServerResponse
  adapter: Adapter
}) => InternalAdapter

export const createInternalAdapter: CreateInternalAdapter = ({
  params,
  req,
  res,
  adapter,
}) => {
  return {
    getSession: async ({ spaceId, userId }) => {
      try {
        const session = await adapter.getItem({
          req,
          res,
          clientId: params.clientId,
          spaceId,
          userId,
        })

        if (!session) {
          return undefined
        }

        return session
      } catch (e) {
        console.log('Retrieving the session failed: ', e)
        return undefined
      }
    },

    setSession: async ({ spaceId, userId, session }) => {
      try {
        await adapter.setItem({
          req,
          res,
          clientId: params.clientId,
          spaceId,
          userId,
          value: session,
        })
      } catch (e) {
        console.log('Setting a session failed: ', e)
        return false
      }
    },

    hasSession: ({ spaceId, userId }) => {
      try {
        adapter.hasItem({
          req,
          res,
          clientId: params.clientId,
          spaceId,
          userId,
        })
      } catch (e) {
        console.log('Session could not be found: ', e)

        return false
      }
    },

    removeSession: async ({ spaceId, userId }) => {
      try {
        await adapter.removeItem({
          req,
          res,
          clientId: params.clientId,
          spaceId,
          userId,
        })
      } catch (e) {
        console.log('Removing session failed', e)
        return false
      }
    },

    setCallbackData: (data) => {
      const signedData = signData(params.clientSecret, data)
      setCookie(res, callbackCookieName, signedData)
      return true
    },

    getCallbackData: () => {
      const cookie = getCookie(req, callbackCookieName)
      const data = verifyData(params.clientSecret, cookie || '') as
        | CallbackCookieData
        | undefined
      return data
    },

    removeCallbackData: () => {
      expireCookie(res, callbackCookieName)
      return true
    },
  }
}
