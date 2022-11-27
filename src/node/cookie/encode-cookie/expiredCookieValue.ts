export const expiredCookieValue = (name: string) =>
  `${name}=""; path=/; samesite=none; secure; httponly; expires=Thu, 01 Jan 1970 00:00:00 GMT`
