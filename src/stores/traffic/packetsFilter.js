/*
 * The traffic viewers filter packets by event type, by connection and by a sequence of bytes. The
 * `filter` of the packets API is a flespi expression over the packet fields (`type`, `conn`, `data`),
 * so the filters are sent along with every request: the search covers the whole period, not just the
 * pages already loaded. The list still checks every packet itself — the server filter for the bytes
 * is only a superset of the exact match, and a single byte cannot be expressed at all.
 */

/* packet types by the event they stand for — a type missing here is never filtered out */
export const EVENT_CATEGORIES = {
  0: 'connect', 32: 'connect', 512: 'connect',
  1: 'disconnect', 33: 'disconnect', 513: 'disconnect',
  2: 'received', 130: 'received', 66: 'received', 34: 'received', 258: 'received', 514: 'received',
  3: 'sent', 67: 'sent', 131: 'sent', 35: 'sent', 259: 'sent', 515: 'sent'
}

/* the API refuses a longer filter */
const FILTER_MAX_LENGTH = 1024

export function normalizeHex (value) {
  return (value || '').replace(/[\s:.-]/g, '').toUpperCase()
}

/* a byte sequence starts on a byte boundary: `F3` is not to be found in the middle of `0F 38` */
export function hexIncludes (hex, needle) {
  let index = hex.indexOf(needle)
  while (index !== -1) {
    if (index % 2 === 0) { return true }
    index = hex.indexOf(needle, index + 1)
  }
  return false
}

function bytesToBase64 (bytes) {
  return btoa(String.fromCharCode(...bytes))
}

/*
 * `data` is base64 inside the filter expression, and the same bytes encode differently depending on
 * their offset in the packet modulo 3. For each offset only the base64 characters made of the needle
 * bits alone are kept; a packet that contains the bytes contains one of the three. The match is not
 * held to a character boundary, so a short needle brings some packets that do not contain it.
 * Returns null when the needle is too short to give characters of its own at every offset.
 */
function base64Variants (bytes) {
  const variants = []
  for (let offset = 0; offset < 3; offset++) {
    const encoded = bytesToBase64([...new Array(offset).fill(0), ...bytes])
    const part = encoded.slice(Math.ceil(offset * 8 / 6), Math.floor((offset + bytes.length) * 8 / 6))
    if (!part) { return null }
    variants.push(part)
  }
  return variants
}

function dataCondition (hexNeedle, maxLength) {
  /* an odd digit at the end is not a byte yet, the bytes before it still narrow the search */
  let bytes = (hexNeedle.match(/../g) || []).map(byte => parseInt(byte, 16))
  /* a prefix of the needle still selects a superset of the packets, and fits the length limit */
  while (bytes.length) {
    const variants = base64Variants(bytes)
    if (!variants) { return '' }
    const condition = `(${variants.map(variant => `data~"*${variant}*"`).join('||')})`
    if (condition.length <= maxLength) { return condition }
    bytes = bytes.slice(0, -1)
  }
  return ''
}

export function buildPacketsFilter ({ eventFilter, connFilter, hexNeedle }) {
  const conditions = []
  const excludedTypes = Object.keys(EVENT_CATEGORIES).filter(type => !eventFilter[EVENT_CATEGORIES[type]])
  if (excludedTypes.length) {
    conditions.push(excludedTypes.map(type => `type!=${type}`).join('&&'))
  }
  if (connFilter !== null && connFilter !== undefined) {
    conditions.push(`conn==${connFilter}`)
  }
  const head = conditions.join('&&')
  if (hexNeedle) {
    const condition = dataCondition(hexNeedle, FILTER_MAX_LENGTH - head.length - 2)
    if (condition) { conditions.push(condition) }
  }
  return conditions.join('&&')
}

/* where the needle occurs in the packet, as ranges of byte indexes — for highlighting it */
export function hexMatches (hex, needle) {
  const matches = []
  if (!hex || !needle) { return matches }
  let index = hex.indexOf(needle)
  while (index !== -1) {
    if (index % 2 === 0) {
      matches.push({ start: index / 2, end: (index + needle.length - 1) >> 1 })
    }
    index = hex.indexOf(needle, index + 1)
  }
  return matches
}

/* the exact check of a packet against the filters, on top of what the server returned */
export function packetMatches (packet, { eventFilter, connFilter, hexNeedle }, toHex) {
  const category = EVENT_CATEGORIES[packet.type]
  if (category && !eventFilter[category]) { return false }
  if (connFilter !== null && packet.conn !== connFilter) { return false }
  if (hexNeedle && (!packet.data || !hexIncludes(toHex(packet.data), hexNeedle))) { return false }
  return true
}
