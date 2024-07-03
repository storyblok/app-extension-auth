import http from 'http'
import { ResponseElement } from './ResponseElement'

/**
 * Writes the changes described by a `ResponseElement` into a Node `http.ServerResponse`.
 * @param res
 * @param responseElement
 */
export const reconcileNodeResponse = async ({
  res,
  responseElement,
}: {
  res: http.ServerResponse
  responseElement: ResponseElement
}) => {
  if (responseElement.type === 'configuration-error') {
    console.error(
      `@stoyblok/app-extension-auth is misconfigured: ${
        responseElement.message ?? ''
      }`,
    )
  }
  if (responseElement.type === 'error' && responseElement.message) {
    console.error(responseElement.message)
  }

  res
    .writeHead(302, {
      Location: responseElement.redirectTo,
    })
    .end()
}
