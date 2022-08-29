export type JwtCookieParams = {
    jwtSecret: string
    // The name of the cookie that will be issued by this api endpoint handler
    cookieName: string
}