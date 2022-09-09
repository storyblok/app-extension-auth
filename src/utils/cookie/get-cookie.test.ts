import httpMocks from "node-mocks-http";
import {getCookie} from "./get-cookie";

const cookieName = 'myCookie'
const cookieValue = 'abc123'

const mockRequest = (cookieHeader?: string) => (
  httpMocks.createRequest({
    method: 'POST',
    url: '/my-fantastic-endpoint',
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json',
      'content-length': '1',
      'x-forwarded-for': '127.0.0.1',
      'cookie': cookieHeader
    },
  })
)

describe('Getting app cookies', () => {
  it("Should get the cookie value when there is a single cookie", () => {
    const req = mockRequest(`${cookieName}=${cookieValue}`)
    expect(getCookie(req, cookieName)).toBe(cookieValue)
  })
  it("Should get the cookie value when there are multiple cookies", () => {
    const req = mockRequest(`firstCookie=firstCookieValue; ${cookieName}=${cookieValue}; lastCookie=lastCookieValue`)
    expect(getCookie(req, cookieName)).toBe(cookieValue)
  })
  it("Should not get the cookie value when there are no cookies", () => {
    const req = mockRequest(undefined)
    expect(getCookie(req, cookieName)).toBeUndefined()
  })
  it("Should not get the cookie value when there is a single cookie", () => {
    const req = mockRequest(`firstCookie=firstCookieValue`)
    expect(getCookie(req, cookieName)).toBeUndefined()
  })
  it("Should not get the cookie value when there are multiple cookies", () => {
    const req = mockRequest(`firstCookie=firstCookieValue; lastCookie=lastCookieValue`)
    expect(getCookie(req, cookieName)).toBeUndefined()
  })
})
