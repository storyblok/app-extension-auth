import { trimSlashes } from './trimSlashes'

describe('trimSlashes', () => {
  it('should trim leading slashes', () => {
    expect(trimSlashes('/hello')).toEqual('hello')
  })
  it('should trim trailing slashes', () => {
    expect(trimSlashes('hello/')).toEqual('hello')
  })
  it('should trim both leading and trailing slashes', () => {
    expect(trimSlashes('/hello/')).toEqual('hello')
  })
  it('should trim long slugs', () => {
    expect(trimSlashes('/hello/my/fellow/bloker/')).toEqual(
      'hello/my/fellow/bloker',
    )
  })
})
