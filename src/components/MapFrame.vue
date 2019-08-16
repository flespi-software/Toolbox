<template>
  <vue-draggable-resizable ref="dragResize" class="map-component__wrapper" :class="[isMapMinimized || isMapMaximized ? 'map-component--minimized' : '']" :active="true" :style="wrapperStyles" :x="startX" :y="startY" :w="width" :h="height" :minw="100" :minh="100" @resizing="mapResizeHandler" :parent="true" @dragging="draggingHandler">
    <q-window-resize-observable @resize="onWindowResize" />
    <div class="map-container__header" :style="{height: `${headerMapHeight}px`}" v-show="!isMapMinimized && !isMapMaximized">
      <q-icon @mousedown.stop.prevent.native="closeMapHandler" name="mdi-close" class="float-right cursor-pointer" color="white"/>
      <q-icon @mousedown.stop.prevent.native="maximizeHandler" :name="isMapMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" class="float-right cursor-pointer" color="white"/>
      <q-icon v-if="siblingHeight !== 0" @mousedown.stop.prevent.native="minimizeHandler('bottom')" name="mdi-arrow-bottom-right" class="float-right cursor-pointer" color="white"/>
      <q-icon v-if="siblingHeight !== 100" :class='{[`height${siblingHeight}`]: true}' @mousedown.stop.prevent.native="minimizeHandler('top')" name="mdi-arrow-top-right" class="float-right cursor-pointer" color="white"/>
    </div>
    <div id="map" :style="mapStyles" class="relative-position">
      <iframe :src="link" frameborder="0" ref="frame" class="absolute-top-left absolute-bottom-right" style="width : 100%; height: 100%;"></iframe>
    </div>
    <div class="map-component__custom-controls" v-if="isMapMinimized || isMapMaximized">
      <q-icon @mousedown.stop.prevent.native="closeMapHandler" name="mdi-close" class="pull-right cursor-pointer" size="30px" color="dark"/>
      <q-icon v-if="isMapMinimized" @mousedown.stop.prevent.native="restoreHandler" name="mdi-window-restore" size="30px" class="pull-right cursor-pointer" color="dark"/>
      <q-icon v-if="isMapMaximized" @mousedown.stop.prevent.native="maximizeHandler" :name="isMapMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" size="30px" class="pull-right cursor-pointer" color="dark"/>
    </div>
  </vue-draggable-resizable>
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
      lastCommand: null
    }
  },
  computed: {
    mapStyles () {
      if (this.device) {
        return {
          width: `${this.width}px`,
          height: `${this.height - (this.isMapMinimized || this.isMapMaximized ? 0 : this.headerMapHeight)}px`
        }
      }
    },
    wrapperStyles () {
      if (this.device) {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`,
          position: 'absolute',
          backgroundColor: '#666'
        }
      }
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
      let parentW = parseInt(this.$el.parentNode.clientWidth, 10),
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
      let parentW = parseInt(this.$el.parentNode.clientWidth, 10) - 1,
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
    addMarker (marker) {},
    addRoute (route) {
      this.lastCommand = `MapView|cmd:{"addgroutes": [${JSON.stringify(route)}], "clear": "all"}`
      this.sendCommand(this.lastCommand)
    },
    addRoutes (routes) {
      this.lastCommand = `MapView|cmd:{"addgroutes": ${JSON.stringify(routes)}, "clear": "all"}`
      this.sendCommand(this.lastCommand)
    },
    clear () {
      this.lastCommand = null
      this.sendCommand(`MapView|cmd:{"clear": "all"}`)
    },
    sendCommand (command) {
      this.$refs.frame && command && this.$refs.frame.contentWindow.postMessage(command, '*')
    }
  },
  mounted () {
    this.winHeight = document.documentElement.clientHeight
    this.winWidth = document.documentElement.clientWidth
  },
  created () {
    window.addEventListener('message', (e) => {
      if (e.data === 'MapView|state:{"ready": true}') {
        this.sendCommand(this.lastCommand)
      }
    })
  },
  watch: {
    minimizeTo (minimizeTo) {
      if (minimizeTo) {
        this.minimize(minimizeTo)
      } else {
        this.width = this.prevWidth
        this.height = this.prevHeight
      }
    }
  },
  components: { VueDraggableResizable }
}
</script>

<style lang="stylus">
  .map-component__wrapper
    .map-component__custom-controls
      position absolute
      top 4px
      right 4px
      z-index 999
    &.map-component--minimized
      .handle
        display none!important
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
      right 0
      border-left 1px solid #616161
    .handle-ml
      left 0
      border-right 1px solid #616161
    .handle-tm, .handle-bm
      left 5px
      width 100%
      margin-top 0
      height 4px
      border none
      background-color inherit
      display block!important
      z-index 998
    .handle-tm
      top 0
      border-bottom 1px solid #616161
    .handle-bm
      bottom 0
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
      left 0
      top 0
    .handle-bl
      left 0
      bottom 0
    .handle-br
      right 0
      bottom 0
    .handle-tr
      right 0
      top 0
</style>
