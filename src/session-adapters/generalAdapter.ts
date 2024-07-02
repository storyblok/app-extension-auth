import { IncomingMessage, ServerResponse } from 'node:http'

export type MaybePromise<T> = T | Promise<T>

export type Adapter = {
  getItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    key: string
  }) => MaybePromise<string | object | undefined>

  setItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    key: string
    value: string | object
  }) => MaybePromise<void>

  removeItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    key: string
  }) => MaybePromise<void>

  hasItem: (params: {
    req: IncomingMessage
    res: ServerResponse
    key: string
  }) => MaybePromise<boolean>
}
