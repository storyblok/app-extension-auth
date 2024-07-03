import http from 'http'
import { Adapter, MaybePromise } from './generalAdapter'
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
import { DEFAULT_SESSION_IDENTIFIER } from '../session/sessionIdentifier'

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
  req,
  res,
  adapter,
}: {
  req: http.IncomingMessage
  res: http.ServerResponse
  adapter: Adapter
}) => InternalAdapter

const clientSecret = process.env['CLIENT_SECRET'] || ''

export const createInternalAdapter: CreateInternalAdapter = ({
  req,
  res,
  adapter,
}) => ({
  getSession: async ({ spaceId, userId }) => {
    const session = await adapter.getItem({
      req,
      res,
      spaceId,
      userId,
      key: DEFAULT_SESSION_IDENTIFIER,
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
        spaceId,
        userId,
        key: DEFAULT_SESSION_IDENTIFIER,
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
      spaceId,
      userId,
      key: DEFAULT_SESSION_IDENTIFIER,
    }),

  removeSession: async ({ spaceId, userId }) => {
    try {
      return await adapter.removeItem({
        req,
        res,
        spaceId,
        userId,
        key: DEFAULT_SESSION_IDENTIFIER,
      })
    } catch (err) {
      return false
    }
  },

  setCallbackData: (data) => {
    const signedData = signData(clientSecret)(data)
    setCookie(res, callbackCookieName, signedData)
    return true
  },

  getCallbackData() {
    const cookie = getCookie(req, callbackCookieName)
    const data = verifyData(clientSecret)(cookie || '') as
      | CallbackCookieData
      | undefined
    return data
  },

  removeCallbackData() {
    expireCookie(res, callbackCookieName)
    return true
  },
})
