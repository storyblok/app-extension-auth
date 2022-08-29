/**
 * The data that is returned from https://app.storyblok.com/oauth/user_info
 */
type UserInfo = {
    user: User,
    space: Space,
    roles: Role[],
}

type User = {
    id: number
    friendly_name: string
}

type Space = {
    id: number
    name: string
}

type Role = {
    name: string
}

export {UserInfo, User, Space, Role}