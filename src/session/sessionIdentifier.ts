import { AuthHandlerParams } from '../storyblok-auth-api'

const defaultSessionIdentifier = 'sb.auth'
export const sessionIdentifier = (
  params: Pick<AuthHandlerParams, 'cookieName'>,
) => params.cookieName ?? defaultSessionIdentifier
