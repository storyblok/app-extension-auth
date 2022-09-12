import http from 'http'

export type RequestParams = {
  req: http.IncomingMessage
  res: http.ServerResponse
}
