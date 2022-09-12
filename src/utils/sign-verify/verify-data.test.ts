import { verifyData } from './verify-data'
import jwt from 'jsonwebtoken'
import { signData } from './sign-data'

const testSecret =
  'fkxAHP5whEOjjJh4SFvYvQ9BiqBc8DMqQiX4MMFOcSUx5Qh5xxOI2wqQMRfK53aTOyc5RyEimYQBsA7lWu9kag=='
const testCookieValue = {
  propA: 123,
  propB: 'abc',
  propC: {
    propC1: [1, 2, 3, 'a', 'b', 'c'],
    propC2: null,
  },
}

const sign = signData(testSecret)
const verify = verifyData(testSecret)

describe('verifyData', () => {
  it('should be the inverse of signData', () => {
    expect(testCookieValue).toEqual(verify(sign(testCookieValue)))
  })
  it('should return undefined if the jwtSecret is invalid', () => {
    expect(
      verifyData('incorrectJwtSecret')(sign(testCookieValue)),
    ).toBeUndefined()
  })
  it('should return undefined if the jwtToken is invalid', () => {
    expect(verify('ey.thisis.gibberish==')).toBeUndefined()
  })
  it('should return undefined if the jwtSecret is signed without signSession', () => {
    expect(verify(jwt.sign({ hello: 'world' }, testSecret))).toBeUndefined()
  })
})
