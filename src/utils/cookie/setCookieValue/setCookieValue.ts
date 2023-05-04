// TODO URL encode the value
export const setCookieValue = (name: string, value: string) =>
  `${name}=${value}; path=/; samesite=none; secure; httponly`
