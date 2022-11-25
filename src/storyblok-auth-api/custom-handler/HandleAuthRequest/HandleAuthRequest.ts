import { HandleAnyAuthRequestParams } from '../handle-any-auth-request'
import { HandleAuthRequestResult } from './HandleAuthRequestResult'

export type HandleAuthRequest = (
  params: HandleAnyAuthRequestParams,
) => Promise<HandleAuthRequestResult>
