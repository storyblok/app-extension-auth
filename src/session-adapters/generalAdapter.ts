import { IncomingMessage, ServerResponse } from 'node:http'

export type MaybePromise<T> = T | Promise<T>

export type Adapter = {
  getItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    spaceId: string
    userId: string
    key: string
  }) => MaybePromise<string | undefined>

  setItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    spaceId: string
    userId: string
    key: string
    value: string
  }) => MaybePromise<boolean>

  removeItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    spaceId: string
    userId: string
    key: string
  }) => MaybePromise<boolean>

  hasItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    spaceId: string
    userId: string
    key: string
  }) => MaybePromise<boolean>
}
