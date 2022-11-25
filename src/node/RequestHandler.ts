import http from 'http'

export type RequestHandler = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
) => Promise<void>
