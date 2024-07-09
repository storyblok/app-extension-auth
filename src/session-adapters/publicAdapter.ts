import { IncomingMessage, ServerResponse } from 'node:http'
import { AppSession } from '../session'

export type MaybePromise<T> = T | Promise<T>

export type Adapter = {
  getSession: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
  }) => MaybePromise<AppSession | undefined>

  setSession: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
    session: AppSession
  }) => MaybePromise<boolean>

  removeSession: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
  }) => MaybePromise<boolean>

  hasSession: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
  }) => MaybePromise<boolean>
}
