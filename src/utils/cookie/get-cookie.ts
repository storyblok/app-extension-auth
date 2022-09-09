import http from "http";


/**
 * Cache for generated name regular expressions.
 */

const REGEXP_CACHE = Object.create(null)

/**
 * RegExp to match all characters to escape in a RegExp.
 */

const REGEXP_ESCAPE_CHARS_REGEXP = /[\^$\\.*+?()[\]{}|]/g

function getPattern (name: string) {
  if (!REGEXP_CACHE[name]) {
    REGEXP_CACHE[name] = new RegExp(
      '(?:^|;) *' +
      name.replace(REGEXP_ESCAPE_CHARS_REGEXP, '\\$&') +
      '=([^;]*)'
    )
  }

  return REGEXP_CACHE[name]
}

export const getCookie = (request: http.IncomingMessage, name: string): string | undefined => {
  const header = request.headers["cookie"]
  if (!header) {
    return undefined
  }

  const match = header.match(getPattern(name))
  if (!match) {
    return undefined
  }

  const value = match[1]
  if (value[0] === '"') {
    return value.slice(1, -1)
  }
  return value
}
