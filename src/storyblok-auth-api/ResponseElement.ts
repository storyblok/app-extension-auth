/**
 * This object describes an HTTP response in a framework-agnostic way.
 * The idea is to create one function that parses an incoming HTTP message into a `ResponseElement`.
 * This `ResponseElement` is then fed into a _reconciler_ that writes the required changes into an HTTP response.
 */
export type ResponseElement = {
  type: 'success' | 'error' | 'configuration-error'
  redirectTo?: string
  message?: string
}
