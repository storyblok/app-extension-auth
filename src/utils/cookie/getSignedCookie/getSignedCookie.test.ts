import httpMocks from 'node-mocks-http'
import { getSignedCookie } from './getSignedCookie'
import { signData } from '../../signData'

const testSecret =
  'fkxAHP5whEOjjJh4SFvYvQ9BiqBc8DMqQiX4MMFOcSUx5Qh5xxOI2wqQMRfK53aTOyc5RyEimYQBsA7lWu9kag=='
const testCookieName = 'myCookie'
const testCookieValue = {
  propA: 123,
  propB: 'abc',
  propC: {
    propC1: [1, 2, 3, 'a', 'b', 'c'],
    propC2: null,
  },
}

const jwtToken = signData(testSecret)(testCookieValue)

const testCookie = `${testCookieName}=${jwtToken}; path=/; samesite=none; secure; httponly`

const mockRequest = () =>
  httpMocks.createRequest({
    method: 'POST',
    url: '/my-fantastic-endpoint',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      'content-length': '1',
      'x-forwarded-for': '127.0.0.1',
      cookie: testCookie,
    },
  })

describe('getSignedCookie', () => {
  it('should read the value from the request', () => {
    const req = mockRequest()
    expect(getSignedCookie(testSecret)(testCookieName)(req)).toEqual(
      testCookieValue,
    )
  })
  it('should return undefined if the jwtToken is incorrect', () => {
    const req = mockRequest()
    expect(
      getSignedCookie('thisIsNotTheRightSecret')(testCookieName)(req),
    ).toBeUndefined()
  })
  it('should return undefined if the cookie is missing', () => {
    const req = mockRequest()
    expect(
      getSignedCookie(testSecret)('nonExistingCookie')(req),
    ).toBeUndefined()
  })
})
