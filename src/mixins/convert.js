export default {
  methods: {
    base64ToHex (base64) {
      if (typeof base64 !== 'string') { return '' }
      return [...atob(base64)].map(c => c.charCodeAt(0).toString(16).padStart(2, 0)).join('').toUpperCase()
    },
    base64ToText (base64) {
      if (typeof base64 !== 'string') { return '' }
      return atob(base64)
    }
  }
}
