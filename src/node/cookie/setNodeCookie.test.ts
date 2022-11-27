import httpMocks from 'node-mocks-http'
import { expireNodeCookie, setNodeCookie } from './setNodeCookie'
import http from 'http'
import { getSetCookies } from '../../utils/__tests__/get-set-cookies'

const testCookieName = 'myCookie'
const testCookieValue = 'abc123'
const testCookiePattern = new RegExp(`^${testCookieName}=`)

const mockResponse = () => {
  const res = httpMocks.createResponse()
  res.setHeader('Set-Cookie', 'otherCooke=otherCookieValue; httpOnly')
  setNodeCookie(res)('firstCookie', 'firstCookieValue')
  return res
}

const getTestCookie = (res: http.ServerResponse): string | undefined =>
  getSetCookies(res).find((header) => header.match(testCookiePattern))

describe('Setting app cookies', () => {
  it('Should add a Set-Cookie header', () => {
    const res = mockResponse()
    const countBefore = getSetCookies(res).length
    setNodeCookie(res)(testCookieName, testCookieValue)
    const countAfter = getSetCookies(res).length

    expect(countAfter).toBe(countBefore + 1)
  })
  it('Should add a Set-Cookie with the specified name', () => {
    const res = mockResponse()
    setNodeCookie(res)(testCookieName, testCookieValue)

    expect(getTestCookie(res)).toBeDefined()
  })
  it('Should add the value to the cookie', () => {
    const res = mockResponse()
    setNodeCookie(res)(testCookieName, testCookieValue)

    expect(getTestCookie(res)).toMatch(
      new RegExp(`^${testCookieName}=${testCookieValue}`),
    )
  })
  // TODO move to expiredCookieValue and setCookieValue
  it("Should add a cookie with the attribute 'secure'", () => {
    const res = mockResponse()
    setNodeCookie(res)(testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; secure')
  })
  it("Should add a cookie with the attribute 'samesite=none'", () => {
    const res = mockResponse()
    setNodeCookie(res)(testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; samesite=none')
  })
  it("Should add a cookie with the attribute 'path=/'", () => {
    const res = mockResponse()
    setNodeCookie(res)(testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; path=/')
  })
  it("Should add a cookie with the attribute 'httponly'", () => {
    const res = mockResponse()
    setNodeCookie(res)(testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; httponly')
  })
})

describe('Expiring cookies', () => {
  it('Should contain the expiration attribute', () => {
    const res = mockResponse()
    expireNodeCookie(res)(testCookieName)

    expect(getTestCookie(res)).toContain('; expires')
  })
  it('The expiration date should be the start of Unix epoch', () => {
    const res = mockResponse()
    expireNodeCookie(res)(testCookieName)

    expect(getTestCookie(res)).toContain(
      `; expires=${new Date(0).toUTCString()}`,
    )
  })
  it('should have no value', () => {
    const res = mockResponse()
    expireNodeCookie(res)(testCookieName)

    expect(getTestCookie(res)).toContain(`${testCookieName}=""`)
  })
})
