import { numberFromString } from '../../../utils'
import { URL } from 'url'

export const spaceIdFromUrl = (url: string): number | undefined => {
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
