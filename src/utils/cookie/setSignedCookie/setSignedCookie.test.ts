import httpMocks from 'node-mocks-http'
import { setSignedCookie } from './setSignedCookie'
import { setCookie } from '../setCookie'
import { getSetCookies } from '../../__tests__/get-set-cookies'
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

const mockResponse = () => {
  const res = httpMocks.createResponse()
  res.setHeader('Set-Cookie', 'otherCooke=otherCookieValue; httpOnly')
  setCookie(res, 'firstCookie', 'firstCookieValue')
  return {
    res,
    setCookie: (name: string, value: string) => setCookie(res, name, value),
  }
}

describe('setSignedCookie', () => {
  it('add a Set-Cookie header', () => {
    const { res, setCookie } = mockResponse()
    const beforeCount = getSetCookies(res).length
    setSignedCookie(testSecret, setCookie, testCookieName, testCookieValue)
    const afterCount = getSetCookies(res).length
    expect(afterCount).toBe(beforeCount + 1)
  })
  it('add a Set-Cookie header', () => {
    const { res, setCookie } = mockResponse()
    setSignedCookie(testSecret, setCookie, testCookieName, testCookieValue)
    const match = getSetCookies(res).some((header) =>
      header.startsWith(`${testCookieName}=${jwtToken}`),
    )
    expect(match).toBeTruthy()
  })
})
