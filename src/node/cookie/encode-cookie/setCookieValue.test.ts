import { setCookieValue } from './setCookieValue'

const cookieName = 'my-testCookie'
const cookieValue = 'abc-123&;/abc-_'

describe('setCookieValue', () => {
  it('should not contain the expiration attribute', () => {
    expect(setCookieValue(cookieName, cookieValue)).not.toContain('; expires')
  })
  it('has a value', () => {
    expect(setCookieValue(cookieName, cookieValue)).toMatch(
      new RegExp(`^${cookieName}=.+;`),
    )
  })
  it.todo('url encodes the value')
  it('is secure', () => {
    expect(setCookieValue(cookieName, cookieValue)).toContain('; secure')
  })
  it("has the attribute 'samesite=none'", () => {
    // TODO is this attribute really necessary?
    expect(setCookieValue(cookieName, cookieValue)).toContain('; samesite=none')
  })
  it("is visible on all paths ('path=/')", () => {
    expect(setCookieValue(cookieName, cookieValue)).toContain('; path=/')
  })
  it("is 'httponly'", () => {
    expect(setCookieValue(cookieName, cookieValue)).toContain('; httponly')
  })
})
