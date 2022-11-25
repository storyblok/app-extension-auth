import { HandleAuthRequest } from '../utils/HandleAuthRequest'
import { clearCallbackCookieResult } from '../utils/clearCallbackCookieResult'

export const handleUnknown: HandleAuthRequest = async (params) => ({
  type: 'error',
  redirectTo: params.errorCallback,
  setCookies: [clearCallbackCookieResult],
})
