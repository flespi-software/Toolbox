<template>
  <div class="absolute-top-left absolute-bottom-right">
    <vue-draggable-resizable ref="dragResize" class="map-component__wrapper" :class="[isMapMinimized || isMapMaximized ? 'map-component--minimizedc' : '']" :active="true" :style="wrapperStyles" :x="startX" :y="startY" :w="width" :h="height" :minw="100" :minh="100" @resizing="mapResizeHandler" :parent="true" @dragging="draggingHandler">
      <div class="map-container__header" :style="{height: `${headerMapHeight}px`}" v-show="!isMapMinimized && !isMapMaximized" style="padding-right: 1px; padding-top: 3px;">
        <q-icon @mousedown.stop.prevent.native="closeMapHandler" name="mdi-close" class="float-right cursor-pointer" color="white"/>
        <q-icon @mousedown.stop.prevent.native="maximizeHandler" :name="isMapMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" class="float-right cursor-pointer" color="white"/>
        <q-icon v-if="siblingHeight !== 0" @mousedown.stop.prevent.native="minimizeHandler('bottom')" name="mdi-arrow-bottom-right" class="float-right cursor-pointer" color="white"/>
        <q-icon v-if="siblingHeight !== 100" :class='{[`height${siblingHeight}`]: true}' @mousedown.stop.prevent.native="minimizeHandler('top')" name="mdi-arrow-top-right" class="float-right cursor-pointer" color="white"/>
      </div>
      <div id="map" :style="mapStyles" class="relative-position">
        <iframe :src="link" frameborder="0" ref="frame" class="absolute-top-left absolute-bottom-right" style="width : 100%; height: 100%;"></iframe>
      </div>
      <div class="map-component__custom-controls" v-if="isMapMinimized || isMapMaximized">
        <q-icon @mousedown.stop.prevent.native="closeMapHandler" name="mdi-close" class="pull-right cursor-pointer" size="30px" color="grey-9"/>
        <q-icon v-if="isMapMinimized && $q.platform.is.desktop" @mousedown.stop.prevent.native="restoreHandler" name="mdi-window-restore" size="30px" class="pull-right cursor-pointer" color="grey-9"/>
        <q-icon v-if="isMapMaximized && $q.platform.is.desktop" @mousedown.stop.prevent.native="maximizeHandler" :name="isMapMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" size="30px" class="pull-right cursor-pointer" color="grey-9"/>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: 'map-frame',
  props: [
    'device',
    'siblingHeight'
  ],
  data () {
    return {
      link: 'https://flespi.io/mapview',
      height: 520,
      width: 500,
      prevWidth: 0,
      prevHeight: 0,
      headerMapHeight: 20,
      startX: 50,
      startY: 50,
      isMapMinimized: false,
      isMapMaximized: false,
      minimizeTo: '',
      winWidth: 0,
      winHeight: 0,
      lastCommand: {},
      mapInited: false
    }
  },
  computed: {
    mapStyles () {
      const size = {}
      if (this.device) {
        size.width = `${this.width}px`
        size.height = `${this.height - (this.isMapMinimized || this.isMapMaximized ? 0 : this.headerMapHeight)}px`
      }
      return size
    },
    wrapperStyles () {
      let style = {}
      if (this.device) {
        style = {
          width: `${this.width}px`,
          height: `${this.height}px`,
          position: 'absolute',
          backgroundColor: '#666'
        }
      }
      return style
    }
  },
  methods: {
    closeMapHandler () {
      this.$emit('map:close')
      if (this.isMapMinimized) {
        this.$emit('map:minimize', { value: false })
        this.minimizeTo = ''
        this.isMapMinimized = false
      }
      if (this.isMapMaximized) {
        this.isMapMaximized = false
      }
    },
    maximizeHandler () {
      if (this.isMapMaximized) {
        this.width = this.prevWidth
        this.height = this.prevHeight
        this.isMapMaximized = false
      } else {
        this.prevWidth = this.width
        this.prevHeight = this.height
        this.maximize()
      }
    },
    minimizeHandler (type) {
      this.$emit('map:minimize', { type, value: true })
      this.prevWidth = this.width
      this.prevHeight = this.height
      this.isMapMinimized = true
      this.minimizeTo = type
      if (this.isMapMaximized) {
        this.isMapMaximized = false
      }
    },
    restoreHandler () {
      this.$emit('map:minimize', { value: true })
      this.isMapMinimized = false
      this.minimizeTo = ''
      this.$refs.dragResize.left = 50
      this.$refs.dragResize.top = 50
    },
    minimize (minimizeTo) {
      const parentW = parseInt(this.$el.parentNode.clientWidth, 10),
        parentH = parseInt(this.$el.parentNode.clientHeight, 10)
      this.width = parentW * 0.34
      this.height = ((parentH - 50) * ((this.siblingHeight || 100) / 100))
      switch (minimizeTo) {
        case 'bottom': {
          this.$nextTick(() => {
            this.$refs.dragResize.left = parentW * 0.66
            this.$refs.dragResize.top = parentH - this.height
          })
          break
        }
        case 'top': {
          this.$nextTick(() => {
            this.$refs.dragResize.left = parentW * 0.66
            this.$refs.dragResize.top = 50
          })
        }
      }
    },
    maximize () {
      const parentW = parseInt(this.$el.parentNode.clientWidth, 10) - 1,
        parentH = parseInt(this.$el.parentNode.clientHeight, 10) - 4
      this.width = parentW
      this.height = parentH
      this.$nextTick(() => {
        this.$refs.dragResize.left = 0
        this.$refs.dragResize.top = 0
      })
      if (this.isMapMinimized) {
        this.$emit('map:minimize', { value: false })
        this.minimizeTo = ''
        this.isMapMinimized = false
      }
      this.isMapMaximized = true
    },
    mapResizeHandler (left, top, width, height) {
      this.width = width
      this.height = height
    },
    onWindowResize (size) {
      if (this.isMapMinimized) {
        this.minimizeHandler(this.minimizeTo)
        this.minimize(this.minimizeTo)
      } else if (this.isMapMaximized) {
        this.maximize()
      } else {
        if (this.winWidth > size.width) {
          let left = this.$refs.dragResize.left,
            diffX = this.winWidth - size.width
          if (left + this.width >= this.winWidth - 30) {
            if (left) {
              left -= diffX
              if (left < 0) {
                diffX = left * -1
                left = 0
              }
              this.$refs.dragResize.left = left
            }
            if (left === 0) {
              this.$refs.dragResize.width -= diffX
              this.width -= diffX
              if (this.width < 100) {
                this.$refs.dragResize.width = 100
                this.width = 100
              }
            }
          }
        }
        if (this.winHeight > size.height) {
          let top = this.$refs.dragResize.top,
            diffY = this.winHeight - size.height
          if (top + this.height >= this.winHeight - 30) {
            if (top) {
              top -= diffY
              if (top < 0) {
                diffY = top * -1
                top = 0
              }
              this.$refs.dragResize.top = top
            }
            if (top === 0) {
              this.$refs.dragResize.height -= diffY
              this.height -= diffY
              if (this.height < 100) {
                this.$refs.dragResize.height = 100
                this.height = 100
              }
            }
          }
        }
        this.winHeight = document.documentElement.clientHeight
        this.winWidth = document.documentElement.clientWidth
      }
    },
    draggingHandler () {
      if (this.isMapMinimized) {
        this.$emit('map:minimize', { value: false })
        this.minimizeTo = ''
        this.isMapMinimized = false
      }
      if (this.isMapMaximized) {
        this.isMapMaximized = false
      }
    },
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
  mounted () {
    this.winHeight = document.documentElement.clientHeight
    this.winWidth = document.documentElement.clientWidth
    if (this.$q.platform.is.mobile) { this.maximizeHandler() }
  },
  created () {
    const mapInitHandler = (e) => {
      if (e.data === 'MapView|state:{"ready": true}') {
        this.mapInited = true
        this.send()
        window.removeEventListener('message', mapInitHandler)
      }
    }
    window.addEventListener('message', mapInitHandler)
  },
  watch: {
    minimizeTo (minimizeTo) {
      if (minimizeTo) {
        this.minimize(minimizeTo)
      } else {
        this.width = this.prevWidth
        this.height = this.prevHeight
      }
    },
    '$q.screen.width': {
      immediate: true,
      handler (width) {
        this.onWindowResize({
          height: this.$q.screen.height,
          width
        })
      }
    },
    '$q.screen.height': {
      immediate: true,
      handler (height) {
        this.onWindowResize({
          width: this.$q.screen.width,
          height
        })
      }
    }
  },
  components: { VueDraggableResizable }
}
</script>

<style lang="stylus">
  .map-component__wrapper
    z-index 1!important
    .map-component__custom-controls
      position absolute
      top 4px
      right 4px
      z-index 999
    &.map-component--minimized
      .handle
        display none!important
    .handle
      position absolute
    .handle-mr, .handle-ml
      top 0
      height 100%
      margin-top 0
      border none
      width 4px
      background-color inherit
      display block!important
      z-index 998
    .handle-mr
      cursor e-resize
      right 0
      border-left 1px solid #616161
    .handle-ml
      left 0
      cursor w-resize
      border-right 1px solid #616161
    .handle-tm, .handle-bm
      left 0
      width 100%
      margin-top 0
      height 4px
      border none
      background-color inherit
      display block!important
      z-index 998
    .handle-tm
      top 0
      cursor n-resize
      border-bottom 1px solid #616161
    .handle-bm
      bottom 0
      cursor s-resize
      border-top 1px solid #616161
    .handle-tl, .handle-bl, .handle-br, .handle-tr
      width 4px
      height 4px
      margin-top 0
      border none
      background-color inherit
      display block!important
      z-index 999
    .handle-tl
      cursor nw-resize
      left 0
      top 0
    .handle-bl
      cursor sw-resize
      left 0
      bottom 0
    .handle-br
      cursor nwse-resize
      right 0
      bottom 0
    .handle-tr
      cursor nesw-resize
      right 0
      top 0
</style>
