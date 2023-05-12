import { generators } from 'openid-client'
import { openidClient } from '../openidClient'
import { redirectUri } from '../redirectUri'
import { AuthHandlerParams } from '../../AuthHandlerParams'
import { callbackCookieElement } from '../callbackCookie'
import { HandleAuthRequest } from '../HandleAuthRequest'

export const handleSignInRequest: HandleAuthRequest<{
  params: AuthHandlerParams
}> = async ({ params }) => {
  const code_verifier = generators.codeVerifier()
  const state = generators.state()
  const code_challenge = generators.codeChallenge(code_verifier)

  try {
    // TODO get rid of dummy spaceId
    const redirectTo = openidClient(params, 0).authorizationUrl({
      scope: params.scope.join(' '),
      code_challenge,
      state,
      code_challenge_method: 'S256',
      redirect_uri: redirectUri(params),
    })

    return {
      type: 'success',
      redirectTo,
      setCookies: [
        callbackCookieElement(params.clientSecret, {
          returnTo: params?.successCallback ?? '/', // TODO read from request query params, then either use the successCallback as fallback, or remove the entirely
          codeVerifier: code_verifier,
          state,
        }),
      ],
    }
  } catch (e) {
    return {
      type: 'error',
      message: `Unexpected error. ${e instanceof Error ? e.message : ''}`,
    }
  }
}
