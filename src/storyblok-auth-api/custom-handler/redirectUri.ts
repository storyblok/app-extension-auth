import { AuthHandlerParams } from '../AuthHandlerParams'
import { callbackEndpoint } from './api-paths'
import { trimSlashes } from '../../utils/trimSlashes/trimSlashes'

export const redirectUri = (
  params: Pick<AuthHandlerParams, 'baseUrl' | 'endpointPrefix'>,
) =>
  [params.baseUrl, params.endpointPrefix ?? '', callbackEndpoint]
    .map(trimSlashes)
    .filter((str) => str !== '')
    .join('/')
