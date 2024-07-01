import http from 'http'
import { ResponseElement } from './ResponseElement'
import { InternalAdapter } from './AuthHandlerParams'

/**
 * Writes the changes described by a `ResponseElement` into a Node `http.ServerResponse`.
 * @param res
 * @param responseElement
 */
export const reconcileNodeResponse = async ({
  res,
  responseElement,
  adapter,
}: {
  res: http.ServerResponse
  responseElement: ResponseElement
  adapter: InternalAdapter
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

  //TODO improve readability
  if (responseElement.sessions && responseElement.sessions.length > 0) {
    // eslint-disable-next-line functional/no-loop-statement
    for (const { name, value } of responseElement.sessions) {
      if (typeof value === 'undefined') {
        await adapter.removeItem(name)
      } else {
        await adapter.setItem({ key: name, value })
      }
    }
  }

  res
    .writeHead(302, {
      Location: responseElement.redirectTo,
    })
    .end()
}
