import { HandleAnyAuthRequestParams } from '../../../../node/node-auth-request-handler'
import { HandleAuthRequestResult } from '../types/HandleAuthRequestResult'

export type HandleAuthRequest = (
  params: HandleAnyAuthRequestParams,
) => Promise<HandleAuthRequestResult>
