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

describe('getSignedCookie', () => {
  it('should read the value from the request', () => {
    expect(getSignedCookie(testSecret, () => jwtToken, testCookieName)).toEqual(
      testCookieValue,
    )
  })
  it('should return undefined if the jwtToken is incorrect', () => {
    expect(
      getSignedCookie(
        'thisIsNotTheRightSecret',
        () => jwtToken,
        testCookieName,
      ),
    ).toBeUndefined()
  })
  it('should return undefined if the cookie is missing', () => {
    expect(
      getSignedCookie(testSecret, () => undefined, testCookieName),
    ).toBeUndefined()
  })
})
