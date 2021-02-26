<template>
  <iframe :src="link" frameborder="0" ref="frame" class="absolute-top-left absolute-bottom-right" style="width : 100%; height: 100%;"></iframe>
</template>

<script>
export default {
  name: 'map-frame',
  data () {
    return {
      link: 'https://flespi.io/mapview',
      lastCommand: {},
      mapInited: false
    }
  },
  methods: {
    centerMap (point) {
      this.lastCommand.centermap = point
      return this
    },
    autobounds (flag) {
      this.lastCommand.autobounds = flag
      return this
    },
    addMarkers (markers) {
      this.lastCommand.addmarkers = markers
      return this
    },
    /* markers = { 'name': { latlng, direction, title } } */
    addNamedMarkers (markers) {
      this.lastCommand.namedmarkers = markers
      return this
    },
    addPoints (points) {
      this.lastCommand.appendpoints = points
      return this
    },
    addRoutes (routes) {
      this.lastCommand.addgroutes = routes
      return this
    },
    clear (target = 'all') {
      this.lastCommand.clear = target
      return this
    },
    send () {
      if (this.$refs.frame && this.mapInited) {
        this.$refs.frame.contentWindow.postMessage(`MapView|cmd:${JSON.stringify(this.lastCommand)}`, '*')
        this.lastCommand = {}
      }
      return this
    }
  },
  created () {
    const mapInitHandler = (e) => {
      if (e.data === 'MapView|state:{"ready": true}') {
        this.mapInited = true
        this.$refs.frame.contentWindow.postMessage('MapView|cmd:{"ruler": true, "zoomcontrol": true}', '*')
        this.send()
        window.removeEventListener('message', mapInitHandler)
      }
    }
    window.addEventListener('message', mapInitHandler)
  }
}
</script>
