export default {
  data () {
    return { activeConnectionId: null }
  },
  methods: {
    highlightConn (conn) {
      if (conn === this.activeConnectionId) { return }
      this.activeConnectionId = conn
      const head = document.head || document.getElementsByTagName('head')[0]
      if (conn) {
        const highlightClass = document.createElement('style')
        highlightClass.type = 'text/css'
        const styleValue = `.traffic-viewer__item--connection-${conn} { background-color: #546e7a!important; }`
        if (highlightClass.styleSheet) {
          highlightClass.styleSheet.cssText = styleValue
        } else {
          highlightClass.innerText = styleValue
        }
        head.appendChild(highlightClass)
        this.highlightClass = highlightClass
      } else {
        head.removeChild(this.highlightClass)
      }
    }
  }
}
