import http from 'http'
import { Adapter, MaybePromise } from './generalAdapter'

export type InternalAdapter = {
  getItem: (key: string) => MaybePromise<string | object | undefined>
  setItem: (params: {
    key: string
    value: string | object
  }) => MaybePromise<void>
  removeItem: (key: string) => MaybePromise<void>
  hasItem: (key: string) => MaybePromise<boolean>
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

export const createInternalAdapter: CreateInternalAdapter = ({
  req,
  res,
  adapter,
}) => ({
  getItem: (key) =>
    adapter.getItem({
      req,
      res,
      key,
    }),
  setItem: ({ key, value }) =>
    adapter.setItem({
      req,
      res,
      key,
      value,
    }),
  hasItem: (key) =>
    adapter.hasItem({
      req,
      res,
      key,
    }),
  removeItem: (key) =>
    adapter.removeItem({
      req,
      res,
      key,
    }),
})
