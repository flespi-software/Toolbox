/*
 * The flespi REST API takes its object-valued query params as JSON — `?data={"from":1,"to":2}`.
 * axios 0.x, which the Vue 2 build resolved through flespi-io-js 2.x, serialized them exactly that
 * way; axios 1.x writes `?data[from]=1&data[to]=2` instead, which the API does not read, so every
 * request silently came back unfiltered.
 *
 * This is axios 0.21's `buildURL` serializer, kept as the library's own so the requests look the
 * same as they did before.
 */

/* axios 0.x left these characters alone rather than percent-encoding them */
function encode (val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export default function paramsSerializer (params) {
  const parts = []

  Object.keys(params || {}).forEach(key => {
    let val = params[key]
    if (val === null || typeof val === 'undefined') { return }

    let name = key
    if (Array.isArray(val)) {
      name = `${key}[]`
    } else {
      val = [val]
    }

    val.forEach(v => {
      if (v instanceof Date) {
        v = v.toISOString()
      } else if (v !== null && typeof v === 'object') {
        v = JSON.stringify(v)
      }
      parts.push(`${encode(name)}=${encode(v)}`)
    })
  })

  return parts.join('&')
}
