import { expiredCookieValue } from './expiredCookieValue'

const cookieName = 'my-cookieName'

describe('expiredCookieValue', () => {
  it('should contain the expiration attribute', () => {
    expect(expiredCookieValue(cookieName)).toContain('; expires')
  })
  test('that the expiration date should be the start of Unix epoch', () => {
    expect(expiredCookieValue(cookieName)).toContain(
      `; expires=${new Date(0).toUTCString()}`,
    )
  })
  it('has no value', () => {
    expect(expiredCookieValue(cookieName)).toContain(`${cookieName}=""`)
  })
  it('is secure', () => {
    expect(expiredCookieValue(cookieName)).toContain('; secure')
  })
  it("has the attribute 'samesite=none'", () => {
    // TODO is this attribute really necessary?
    expect(expiredCookieValue(cookieName)).toContain('; samesite=none')
  })
  it("is visible on all paths ('path=/')", () => {
    expect(expiredCookieValue(cookieName)).toContain('; path=/')
  })
  it("is 'httponly'", () => {
    expect(expiredCookieValue(cookieName)).toContain('; httponly')
  })
})
