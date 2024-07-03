import { AuthHandlerParams } from '../storyblok-auth-api'

export const DEFAULT_SESSION_IDENTIFIER = 'sb.auth'

export const sessionIdentifier = (
  params: Pick<AuthHandlerParams, 'cookieName'>,
) => params.cookieName ?? DEFAULT_SESSION_IDENTIFIER
