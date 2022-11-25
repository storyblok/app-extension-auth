import { generators } from 'openid-client'
import { callbackCookieName } from '../../callback-cookie'
import { createOpenidClient } from '../../openidClient'
import { redirectUri } from '../../redirectUri'
import { signData } from '../../../../utils/sign-verify/sign-data'
import { HandleAuthRequest } from '../utils/HandleAuthRequest'

export const handleSignIn: HandleAuthRequest = async (params) => {
  const code_verifier = generators.codeVerifier()
  const state = generators.state()
  const code_challenge = generators.codeChallenge(code_verifier)

  // TODO can fail? If so, surround with try catch
  const redirectTo = createOpenidClient(params).authorizationUrl({
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
      {
        name: callbackCookieName,
        value: signData(params.clientSecret)({
          returnTo: params?.successCallback ?? '/', // TODO read from request query params, then use fallbacks
          codeVerifier: code_verifier,
          state,
        }),
      },
    ],
  }
}
