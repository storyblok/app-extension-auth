import { numberFromString } from '../../../utils'
import { Region } from '../../../session'

const spaceIdFromUrl = (url: string): number | undefined => {
  const isRelativeUrl = !url.startsWith('http')

  const spaceStr = new URL(
    url,
    isRelativeUrl ? 'https://dummy.com' : undefined,
  ).searchParams.get('space_id')
  if (!spaceStr) {
    return undefined
  }
  return numberFromString(spaceStr)
}
const isEuSpace = (spaceId: number) => spaceId >= 0 && spaceId < 1000000
const isUsSpace = (spaceId: number) => spaceId >= 1000000 && spaceId < 2000000

export const regionFromUrl = (url: string): Region | undefined => {
  const spaceId = spaceIdFromUrl(url)
  if (typeof spaceId === 'undefined') {
    return undefined
  }
  if (isEuSpace(spaceId)) {
    return 'eu'
  }
  if (isUsSpace(spaceId)) {
    return 'us'
  } else {
    return undefined
  }
}
