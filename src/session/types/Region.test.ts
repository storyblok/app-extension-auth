import { isRegion } from './Region'

describe('Region', () => {
  describe('validation', () => {
    it('can be "eu"', () => {
      expect(isRegion('eu')).toEqual(true)
    })
    it('can be "us"', () => {
      expect(isRegion('eu')).toEqual(true)
    })
    it('cannot be anything else', () => {
      expect(isRegion('de')).toEqual(false)
      expect(isRegion('abc')).toEqual(false)
      expect(isRegion(1)).toEqual(false)
      expect(isRegion([])).toEqual(false)
    })
  })
})
