export type JwtCookieParams = {
  // The secret that will be used to sign session data.
  jwtSecret: string
  // The name of the cookie that will store session data.
  cookieName?: string
}
