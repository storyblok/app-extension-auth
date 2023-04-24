import httpMocks from 'node-mocks-http'
import { expireCookie, setCookie } from './set-cookie'
import http from 'http'
import { getSetCookies } from '../__tests__/get-set-cookies'

const testCookieName = 'myCookie'
const testCookieValue = 'abc123'
const testCookiePattern = new RegExp(`^${testCookieName}=`)

const mockResponse = () => {
  const res = httpMocks.createResponse()
  res.setHeader('Set-Cookie', 'otherCooke=otherCookieValue; httpOnly')
  setCookie(res, 'firstCookie', 'firstCookieValue')
  return res
}

const getTestCookie = (res: http.ServerResponse): string | undefined =>
  getSetCookies(res).find((header) => header.match(testCookiePattern))

describe('Setting app cookies', () => {
  it('Should add a Set-Cookie header', () => {
    const res = mockResponse()
    const countBefore = getSetCookies(res).length
    setCookie(res, testCookieName, testCookieValue)
    const countAfter = getSetCookies(res).length

    expect(countAfter).toBe(countBefore + 1)
  })
  it('Should add a Set-Cookie with the specified name', () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    expect(getTestCookie(res)).toBeDefined()
  })
  it('Should add the value to the cookie', () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    expect(getTestCookie(res)).toMatch(
      new RegExp(`^${testCookieName}=${testCookieValue}`),
    )
  })
  it("Should add a cookie with the attribute 'secure'", () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; secure')
  })
  it("Should add a cookie with the attribute 'samesite=none'", () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; samesite=none')
  })
  it("Should add a cookie with the attribute 'path=/'", () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; path=/')
  })
  it("Should add a cookie with the attribute 'httponly'", () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    expect(getTestCookie(res)).toContain('; httponly')
  })
  it('has expiration date more than a month in advance', () => {
    const res = mockResponse()
    setCookie(res, testCookieName, testCookieValue)

    const cookie = getTestCookie(res)
    const num = Number(cookie?.match(/Max-Age=(-?\d+)/)?.[1])
    expect(num).toBeDefined()
    expect(num).not.toBeNaN()

    const secondsInOneMonth = 60 * 60 * 24 * 31
    expect(num).toBeGreaterThan(secondsInOneMonth)
  })
})

describe('Expiring cookies', () => {
  it('Should contain the Max-Age attribute', () => {
    const res = mockResponse()
    expireCookie(res, testCookieName)

    expect(getTestCookie(res)).toContain('; Max-Age')
  })
  it('The Max-Age time should be less or equal to zero', () => {
    const res = mockResponse()
    expireCookie(res, testCookieName)

    const cookie = getTestCookie(res)
    const num = Number(cookie?.match(/Max-Age=(-?\d+)/)?.[1])
    expect(num).toBeDefined()
    expect(num).not.toBeNaN()
    expect(num).toBeLessThanOrEqual(0)
  })
  it('should have no value', () => {
    const res = mockResponse()
    expireCookie(res, testCookieName)

    expect(getTestCookie(res)).toContain(`${testCookieName}=""`)
  })
})
