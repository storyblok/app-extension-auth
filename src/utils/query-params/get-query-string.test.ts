import { getQueryFromUrl } from './get-query-string'

describe('getQueryStringFromUrl()', () => {
  it('should work for urls without trailing slash', () => {
    const testString = 'https://test.com?hello=2'
    expect(getQueryFromUrl(testString)).not.toBeUndefined()
  })

  it('should work for urls without trailing slash', () => {
    const testString = '/?hello=2'
    expect(getQueryFromUrl(testString)).not.toBeUndefined()
  })

  it('should work for urls without trailing slash', () => {
    const testString = '?hello=2'
    expect(getQueryFromUrl(testString)).not.toBeUndefined()
  })

  it('should work for urls without trailing slash', () => {
    const testString = 'https://test.com'
    expect(getQueryFromUrl(testString)).toBeUndefined()
  })
})
