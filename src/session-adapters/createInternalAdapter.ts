import http from 'http'
import {
  Adapter,
  InternalAdapter,
} from '../storyblok-auth-api/AuthHandlerParams'

export const createInternalAdapter = ({
  req,
  res,
  adapter,
}: {
  req: http.IncomingMessage
  res: http.ServerResponse
  adapter: Adapter
}): InternalAdapter => ({
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
