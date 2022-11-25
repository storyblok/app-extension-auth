import { HandleAuthRequest } from '../HandleAuthRequest/HandleAuthRequest'
import { clearCallbackCookie } from '../handleCallback/clear-callback-cookie'

export const handleUnknownEndpoint: HandleAuthRequest = async (params) => ({
  type: 'error',
  redirectTo: params.errorCallback,
  setCookies: [clearCallbackCookie],
})
