import { AppSessionKeys, AppSessionQuery } from './types'

export const keysFromQuery = (keys: AppSessionQuery): AppSessionKeys => {
  const { spaceId, userId } = keys
  return {
    spaceId: typeof spaceId === 'number' ? spaceId : parseInt(spaceId, 10),
    userId: typeof userId === 'number' ? userId : parseInt(userId, 10),
  }
}
