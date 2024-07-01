import { AuthHandlerParams } from '../../AuthHandlerParams'
import { HandleAuthRequest } from '../HandleAuthRequest'

import { clearCallbackData } from '../callbackCookie'

export const handleUnknownRequest: HandleAuthRequest<{
  params: AuthHandlerParams
}> = async ({ params }) => ({
  type: 'error',
  redirectTo: params.errorCallback,
  sessions: [clearCallbackData],
})
