import httpMocks from 'node-mocks-http'
import { setCookie } from '../cookie/set-cookie'
import { signData } from '../sign-verify/sign-data'
import { getSetCookies } from '../__tests__/get-set-cookies'
import { setSignedCookie } from './set-signed-cookie'

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

// const testCookie = `${testCookieName}=${jwtToken}; path=/; samesite=none; secure; httponly`

const mockResponse = () => {
  const res = httpMocks.createResponse()
  res.setHeader('Set-Cookie', 'otherCooke=otherCookieValue; httpOnly')
  setCookie(res, 'firstCookie', 'firstCookieValue')
  return res
}

describe('setSignedCookie', () => {
  it('add a Set-Cookie header', () => {
    const res = mockResponse()
    const beforeCount = getSetCookies(res).length
    setSignedCookie(testSecret)(testCookieName)(testCookieValue)(res)
    const afterCount = getSetCookies(res).length
    expect(afterCount).toBe(beforeCount + 1)
  })
  it('add a Set-Cookie header', () => {
    const res = mockResponse()
    setSignedCookie(testSecret)(testCookieName)(testCookieValue)(res)
    const match = getSetCookies(res).some((header) =>
      header.startsWith(`${testCookieName}=${jwtToken}`),
    )
    expect(match).toBeTruthy()
  })
})
