/* eslint-disable @typescript-eslint/ban-ts-comment */
import { refreshToken, RefreshTokenWithFetchParams } from './refreshToken'

const access_token = 'abc90fw4ke903kj390j'
const expires_in = 899
const refreshTokenResponse = {
  access_token,
  expires_in,
  token_type: 'bearer',
}

const refresh_token = 'jfioj98cj940043k903289'
const baseUrl = 'https://myapp.com'
const endpointPrefix = 'api'
const callbackUrl = `${baseUrl}/${endpointPrefix}/storyblok/callback`
const callbackUrlWithoutApiPrefix = `${baseUrl}/storyblok/callback`
const clientId = 'my-app123'
const clientSecret = 'abc123abc'

const parseFormData = (formData: string) =>
  formData
    .split('&')
    .map((pair) => pair.split('='))
    .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    .reduce((acc, [key, value]) => {
      // eslint-disable-next-line functional/immutable-data,@typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

// @ts-ignore
const fetchWithFail: typeof fetch = async () => ({
  text: async () => 'error',
  ok: false,
  status: 400,
})

// @ts-ignore
const fetchWithApiPrefix: typeof fetch = async (url, init) => {
  const data = parseFormData(init?.body as string)
  if (
    // @ts-ignore
    init.headers?.['Content-Type'] !== 'application/x-www-form-urlencoded' ||
    // @ts-ignore
    init.headers?.['Accept'] !== 'application/json' ||
    data.redirect_uri !== callbackUrl ||
    data.client_id !== clientId ||
    data.client_secret !== clientSecret ||
    data.refresh_token !== refresh_token ||
    data.grant_type !== 'refresh_token'
  ) {
    return fetchWithFail(url, init)
  }
  return {
    json: async () => refreshTokenResponse,
    text: async () => JSON.stringify(refreshTokenResponse),
    ok: true,
    status: 200,
  }
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fetchWithoutApiPrefix: typeof fetch = async (url, init) => {
  const data = parseFormData(init?.body as string)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (init.headers?.['Content-Type'] !== 'application/x-www-form-urlencoded') {
    return {
      text: async () => 'error',
      ok: false,
      status: 400,
    }
  }
  if (data.redirect_uri !== callbackUrlWithoutApiPrefix) {
    console.log(
      'redirect_uri missmatch',
      data.redirect,
      callbackUrlWithoutApiPrefix,
    )
    return {
      text: async () => 'error',
      ok: false,
      status: 400,
    }
  }
  return {
    json: async () => refreshTokenResponse,
    text: async () => JSON.stringify(refreshTokenResponse),
    ok: true,
    status: 200,
  }
}

const params: RefreshTokenWithFetchParams = {
  endpointPrefix,
  baseUrl,
  clientSecret,
  clientId,
}

describe('refreshToken', () => {
  it('should refresh the token', async () => {
    const refreshedToken = await refreshToken(fetchWithApiPrefix)(params)(
      refresh_token,
    )
    expect(refreshedToken).toEqual({
      access_token,
      expires_in,
    })
  })
  it('the prefix should be optional', async () => {
    const refreshedToken = await refreshToken(fetchWithoutApiPrefix)({
      clientId,
      clientSecret,
      endpointPrefix: undefined,
      baseUrl,
    })(refresh_token)
    expect(refreshedToken).toEqual({
      access_token,
      expires_in,
    })
  })
  it('should return undefined when the refresh fail', async () => {
    const refreshedToken = await refreshToken(fetchWithFail)(params)(
      refresh_token,
    )
    expect(refreshedToken).toBeUndefined()
  })
  test('that the result does not contain any additional properties', async () => {
    const refreshedToken = await refreshToken(fetchWithApiPrefix)(params)(
      refresh_token,
    )
    expect(refreshedToken).toEqual({
      access_token,
      expires_in,
    })
  })
  //  Test form
})
