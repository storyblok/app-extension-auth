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
import { sessionIdentifier } from '../session/sessionIdentifier'

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
  params: Pick<AuthHandlerParams, 'clientId' | 'clientSecret' | 'sessionKey'>
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
  const sessionKey = sessionIdentifier(params.sessionKey)

  return {
    getSession: async ({ spaceId, userId }) => {
      const session = await adapter.getItem({
        req,
        res,
        clientId: params.clientId,
        spaceId,
        userId,
        key: sessionKey,
      })
      if (!session) {
        return undefined
      }
      try {
        return JSON.parse(session) as AppSession
      } catch (err) {
        return undefined
      }
    },

    setSession: async ({ spaceId, userId, session }) => {
      try {
        return await adapter.setItem({
          req,
          res,
          clientId: params.clientId,
          spaceId,
          userId,
          key: sessionKey,
          value: JSON.stringify(session),
        })
      } catch (err) {
        return false
      }
    },

    hasSession: ({ spaceId, userId }) =>
      adapter.hasItem({
        req,
        res,
        clientId: params.clientId,
        spaceId,
        userId,
        key: sessionKey,
      }),

    removeSession: async ({ spaceId, userId }) => {
      try {
        return await adapter.removeItem({
          req,
          res,
          clientId: params.clientId,
          spaceId,
          userId,
          key: sessionKey,
        })
      } catch (err) {
        return false
      }
    },

    setCallbackData: (data) => {
      const signedData = signData(params.clientSecret)(data)
      setCookie(res, callbackCookieName, signedData)
      return true
    },

    getCallbackData() {
      const cookie = getCookie(req, callbackCookieName)
      const data = verifyData(params.clientSecret)(cookie || '') as
        | CallbackCookieData
        | undefined
      return data
    },

    removeCallbackData() {
      expireCookie(res, callbackCookieName)
      return true
    },
  }
}
