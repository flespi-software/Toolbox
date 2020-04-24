export default {
  methods: {
    base64ToHex (base64) {
      if (typeof base64 !== 'string') { return '' }
      return [...atob(base64)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).join('').toUpperCase()
    },
    base64ToText (base64) {
      if (typeof base64 !== 'string') { return '' }
      return atob(base64)
    },
    base64ToTextWithMnemoReplacing (base64) {
      if (typeof base64 !== 'string') { return '' }
      const preview = this.base64ToHex(base64)
      const bytesHexArray = preview.match(/.{1,2}/g)
      return bytesHexArray.map((byte) => this.replaceByteWithMnemo(byte)).join('')
    },
    replaceByteWithMnemo (byte) {
      const number = parseInt(byte, 16),
        string = String.fromCharCode(number)
      let result
      if (number < 0x20 || number >= 0x7f || (string.match(/\s/g) && string !== ' ')) {
        if (string === '\r') {
          result = '\\r'
        } else if (string === '\t') {
          result = '\\t'
        } else if (string === '\n') {
          result = '\\n'
        } else {
          result = `\\x${byte}`
        }
      } else {
        result = string
      }
      return result
    }
  }
}
