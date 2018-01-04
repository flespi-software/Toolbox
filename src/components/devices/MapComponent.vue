<template>
  <vue-draggable-resizable ref="dragResize" class="map-component__wrapper" :class="[isMapMinimized || isMapMaximized ? 'map-component--minimized' : '']" :active="true" :style="wrapperStyles" :x="startX" :y="startY" :w="width" :h="height" :minw="100" :minh="100" @resizing="mapResizeHandler" :parent="true" @dragging="draggingHandler">
    <q-window-resize-observable @resize="onWindowResize" />
    <div class="map-container__header" :style="{height: `${headerMapHeight}px`}" v-show="!isMapMinimized && !isMapMaximized">
      <q-icon @mousedown.stop.prevent="closeMapHandler" name="mdi-close" class="pull-right cursor-pointer" color="white"/>
      <q-icon @mousedown.stop.prevent="maximizeHandler" :name="isMapMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" class="pull-right cursor-pointer" color="white"/>
      <q-icon @mousedown.stop.prevent="minimizeHandler('messages')" name="mdi-arrow-bottom-right" class="pull-right cursor-pointer" color="white"/>
      <q-icon @mousedown.stop.prevent="minimizeHandler('logs')" name="mdi-arrow-top-right" class="pull-right cursor-pointer" color="white"/>
    </div>
    <div id="map" v-if="" :style="mapStyles">
      <q-resize-observable @resize="onResize" />
    </div>
    <div class="map-component__custom-controls" v-if="isMapMinimized || isMapMaximized">
      <q-icon @mousedown.stop.prevent="closeMapHandler" name="mdi-close" class="pull-right cursor-pointer" size="30px" color="dark"/>
      <q-icon v-if="isMapMinimized" @mousedown.stop.prevent="restoreHandler" name="mdi-window-restore" size="30px" class="pull-right cursor-pointer" color="dark"/>
      <q-icon v-if="isMapMaximized" @mousedown.stop.prevent="maximizeHandler" :name="isMapMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" size="30px" class="pull-right cursor-pointer" color="dark"/>
    </div>
  </vue-draggable-resizable>
</template>

<script>
  import L from 'leaflet'
  import { QResizeObservable, QIcon, QWindowResizeObservable } from 'quasar-framework'
  import VueDraggableResizable from 'vue-draggable-resizable'

  export default {
    name: 'map-component',
    props: [
      'messages',
      'device',
      'siblingHeight'
    ],
    data () {
      return {
        map: null,
        marker: null,
        track: null,
        zoom: 10,
        color: '#037be3',
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
        winHeight: 0
      }
    },
    computed: {
      mapStyles () {
        if (this.device && this.messages && this.messages.length) {
          return {
            width: `${this.width}px`,
            height: `${this.height - (this.isMapMinimized || this.isMapMaximized ? 0 : this.headerMapHeight)}px`
          }
        }
      },
      wrapperStyles () {
        if (this.device && this.messages && this.messages.length) {
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
      initMap () {
        if (!this.map) {
          let lastMessage = this.messages.length ? this.messages[this.messages.length - 1] : {}
          let position = lastMessage['position.latitude'] && lastMessage['position.longitude'] ? [lastMessage['position.latitude'], lastMessage['position.longitude']] : [51.50853, -0.12574]
          this.map = L.map('map', {
            center: position,
            zoom: this.zoom
          })
          this.map.addEventListener('zoom', e => {
            this.zoom = e.target.getZoom()
          })
          this.map.addEventListener('mousedown', e => {
            e.originalEvent.stopPropagation()
          })
          L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map)
        }
      },
      flyTo (position) {
        this.map.flyTo(position)
      },
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
        }
        else {
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
        this.height = (parentH * (this.siblingHeight / 100)) - 25
        switch (minimizeTo) {
          case 'messages': {
            this.$nextTick(() => {
              this.$refs.dragResize.left = parentW * 0.66
              this.$refs.dragResize.top = this.height + 50
            })
            break
          }
          case 'logs': {
            this.$nextTick(() => {
              this.$refs.dragResize.left = parentW * 0.66
              this.$refs.dragResize.top = 50
            })
          }
        }
      },
      maximize () {
        let parentW = parseInt(this.$el.parentNode.clientWidth, 10) - 1,
          parentH = parseInt(this.$el.parentNode.clientHeight, 10)
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
      generateIcon () {
        return L.divIcon({
          className: `my-div-icon icon-${this.device.id}`,
          iconSize: new L.Point(20, 20),
          html: `<div style="border-color: ${this.color}; transform: rotate(${(this.messages[this.messages.length - 1]['position.direction'] || 0) - 45}deg)" class="my-div-icon__inner"></div><div class="my-div-icon__name">${this.device.name}</div>`
        })
      },
      onResize () {
        if (this.map) {
          this.map.invalidateSize()
        }
      },
      onWindowResize (size) {
        this.onResize()
        if (this.isMapMinimized) {
          this.minimizeHandler(this.minimizeTo)
          this.minimize(this.minimizeTo)
        }
        else if (this.isMapMaximized) {
          this.maximize()
        }
        else {
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
      getLatLngArr () {
        return this.messages.reduce((acc, message) => {
          acc.push([message['position.latitude'], message['position.longitude']])
          return acc
        }, [])
      },
      updateMarkerHandler ({ lastPos }) {
        if (this.marker) {
          this.marker.setLatLng(lastPos).update()
        }
      },
      initMarker () {
        let lastMessage = this.messages[this.messages.length - 1]
        let position = [lastMessage['position.latitude'], lastMessage['position.longitude']]
        this.marker = L.marker(position, {
          icon: this.generateIcon(),
          title: this.device.name
        })
        this.marker.addEventListener('move', e => {
          this.marker.setIcon(this.generateIcon())
          this.marker.update()
        })
        this.marker.addTo(this.map)
      },
      initDeviceOnMap () {
        this.initMarker()
        this.track = L.polyline(this.getLatLngArr(), {color: this.color}).addTo(this.map)
      },
      updateDeviceOnMap () {
        let currentArrPos = this.getLatLngArr(),
          markerWatchedPos = this.marker && this.marker instanceof L.Marker ? this.marker.getLatLng() : {},
          isWatchedPosChanged = this.messages && this.messages.length &&
            markerWatchedPos.lat && markerWatchedPos.lat !== this.messages[this.messages.length - 1]['position.latitude'] &&
            markerWatchedPos.lng && markerWatchedPos.lng !== this.messages[this.messages.length - 1]['position.longitude']
        if (isWatchedPosChanged) {
          this.map.flyTo(currentArrPos[this.messages.length - 1], this.zoom)
        }
        if (this.messages.length) {
          if (!(this.marker instanceof L.Marker)) {
            this.initMarker()
          }
          if (!(this.track instanceof L.Polyline)) {
            this.track = L.polyline(this.getLatLngArr(), {color: this.color}).addTo(this.map)
          }
        }
        this.marker.setLatLng(currentArrPos[this.messages.length - 1]).update()
        this.marker.setOpacity(1)
        this.track.setLatLngs(currentArrPos)
      }
    },
    mounted () {
      this.initMap()
      this.initDeviceOnMap()
      this.winHeight = document.documentElement.clientHeight
      this.winWidth = document.documentElement.clientWidth
    },
    watch: {
      messages (messages) {
        this.updateDeviceOnMap()
      },
      minimizeTo (minimizeTo) {
        if (minimizeTo) {
          this.minimize(minimizeTo)
        }
        else {
          this.width = this.prevWidth
          this.height = this.prevHeight
        }
      }
    },
    components: { QResizeObservable, VueDraggableResizable, QIcon, QWindowResizeObservable }
  }
</script>

<style lang="stylus">
  @import "~leaflet/dist/leaflet.css";
  .my-div-icon__inner
    border 3px solid
    border-radius 50% 0 50% 50%
    background-color rgba(255, 255, 255, .5)
    height 100%
  .my-div-icon__name
    line-height 20px
    font-size .9rem
    font-weight bolder
    position absolute
    top 0
    left 30px
    max-width 200px
    text-overflow ellipsis
    overflow hidden
    background-color rgba(0,0,0,0.5)
    color #fff
    border-radius 5px
    padding 0 5px
    border 1px solid white
    box-shadow 3px 3px 10px #999
  .map-component__wrapper
    .map-component__custom-controls
      position absolute
      top 4px
      right 4px
      z-index 1002
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
      z-index 1001
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
      z-index 1001
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
      z-index 1002
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
