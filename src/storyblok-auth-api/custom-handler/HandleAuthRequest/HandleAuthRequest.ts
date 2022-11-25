import { HandleAnyAuthRequestParams } from '../../../node/node-auth-request-handler'
import { HandleAuthRequestResult } from './HandleAuthRequestResult'

export type HandleAuthRequest = (
  params: HandleAnyAuthRequestParams,
) => Promise<HandleAuthRequestResult>
