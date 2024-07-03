import { URLSearchParams } from 'node:url'

export const getQueryParams = (url: string): URLSearchParams => {
  const queryParams = url.split('?')[1]
  const query = new URLSearchParams(queryParams)

  return query
}
