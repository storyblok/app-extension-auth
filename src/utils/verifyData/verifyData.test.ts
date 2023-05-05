import { verifyData } from './verifyData'
import jwt from 'jsonwebtoken'
import { signData } from '../signData'

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
  it('should return undefined if the secret is invalid', () => {
    expect(
      verifyData('incorrectJwtSecret')(sign(testCookieValue)),
    ).toBeUndefined()
  })
  it('should return undefined if the secret is invalid', () => {
    expect(verify('ey.thisis.gibberish==')).toBeUndefined()
  })
  it('should return undefined if the secret is signed without signSession', () => {
    expect(verify(jwt.sign({ hello: 'world' }, testSecret))).toBeUndefined()
  })
})
