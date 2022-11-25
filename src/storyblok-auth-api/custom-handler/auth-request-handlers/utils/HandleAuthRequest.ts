import { HandleAuthRequestResult } from '../types/HandleAuthRequestResult'
import { AuthHandlerParams } from '../../../AuthHandlerParams'

export type HandleAuthRequest = (
  params: AuthHandlerParams,
) => Promise<HandleAuthRequestResult>
