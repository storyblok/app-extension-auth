import { UserInfo } from '../../user-info/UserInfo/user-info'
import { User } from '../../user-info/User/user'
import { Space } from '../../user-info/Space/space'
import { Role } from '../../user-info/Role/role'
import { isStoryblokGrantCookie } from './isStoryblokGrantCookie'
import { StoryblokGrantResponse } from '../storyblok-grant-response'

const user: User = {
  id: 123,
  friendly_name: 'Johannes Lindgren',
}
const space: Space = {
  id: 123456,
  name: 'My Space',
}
const roles: Role[] = [
  {
    name: 'admin',
  },
  {
    name: 'developer',
  },
]
const profile: UserInfo = {
  user,
  space,
  roles,
}
const response: StoryblokGrantResponse = {
  refresh_token: 'abc1234',
  access_token: 'abc123456787',
  profile,
  raw: {
    expires_in: 123445,
  },
}

describe('isStoryblokGrantResponse', () => {
  it('Should be true', () => {
    expect(
      isStoryblokGrantCookie({
        grant: {
          provider: 'storyblok',
          response,
        },
      }),
    ).toBeTruthy()
  })
})
