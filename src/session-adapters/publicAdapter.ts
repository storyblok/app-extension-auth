import { IncomingMessage, ServerResponse } from 'node:http'
import { AppSession } from '../session'

export type MaybePromise<T> = T | Promise<T>

export type Adapter = {
  getItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
  }) => MaybePromise<AppSession | undefined>

  setItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
    value: AppSession
  }) => MaybePromise<boolean>

  removeItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
  }) => MaybePromise<boolean>

  hasItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    clientId: string
    spaceId: string
    userId: string
  }) => MaybePromise<boolean>
}
