import { redirectUri } from './redirect-uri'

describe('redirectUri()', () => {
  test('all parameters', () =>
    expect(
      redirectUri({
        baseUrl: 'https://mydomain.com/base',
        endpointPrefix: 'api/connect',
      }),
    ).toEqual('https://mydomain.com/base/api/connect/callback'))
})
