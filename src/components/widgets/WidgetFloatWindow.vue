<template>
  <vue-draggable-resizable
    ref="dragResize"
    class="widget__wrapper absolute-top-left absolute-bottom-right"
    :class="[isMinimized || isMaximized ? 'widget--pinned' : '']"
    :style="wrapperStyles" drag-cancel=".widget--drag-stop" :parent="true" :active="true"
    :x="x" :y="y" :w="width" :h="height" :min-width="100" :min-height="100"
    @resizing="resizeHandler" @dragging="draggingHandler"
  >
    <div class="widget__header" :style="{height: `${headerHeight}px`}" v-show="!isMinimized && !isMaximized">
      <q-icon @mousedown.stop.prevent.native="closeHandler" name="mdi-close" class="float-right cursor-pointer" color="white"/>
      <q-icon @mousedown.stop.prevent.native="maximizeHandler(), calculateViewModel()" :name="isMaximized ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" class="float-right cursor-pointer" color="white"/>
      <q-icon v-if="controls.minimizeLeft" @mousedown.stop.prevent.native="minimizeHandler('left'), calculateViewModel()" name="mdi-arrow-collapse-right" class="float-right cursor-pointer" color="white"/>
      <q-icon v-if="controls.minimizeRight" @mousedown.stop.prevent.native="minimizeHandler('right'), calculateViewModel()" name="mdi-arrow-collapse-left" class="float-right cursor-pointer" color="white"/>
    </div>
    <div :style="styles" class="widget__content widget--drag-stop relative-position">
      <slot name="default"></slot>
    </div>
    <div class="widget__custom-controls widget--drag-stop" v-if="isMinimized || isMaximized" :style="{ top: isMaximized ? '3px' : '' }">
      <q-icon v-if="(isMinimized || isMaximized) && ($q.platform.is.desktop && $q.screen.width > 500)" @mousedown.stop.prevent.native="restoreHandler" name="mdi-window-restore" size="25px" class="pull-right cursor-pointer" color="white"/>
      <q-icon @mousedown.stop.prevent.native="closeHandler" name="mdi-close" class="pull-right cursor-pointer" size="25px" color="white"/>
    </div>
  </vue-draggable-resizable>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import debounce from 'lodash/debounce'

export default {
  name: 'widget-float-window',
  props: [
    'controls', 'wrapperSize', 'viewModel'
  ],
  data () {
    return {
      height: 520,
      width: 500,
      prevWidth: 0,
      prevHeight: 0,
      prevX: 0,
      prevY: 0,
      headerHeight: 20,
      x: 50,
      y: 50,
      isMinimized: false,
      isMaximized: false,
      minimizeTo: ''
    }
  },
  computed: {
    styles () {
      return {
        width: `${this.width}px`,
        height: `${this.height - (this.isMinimized || this.isMaximized ? 0 : this.headerHeight)}px`
      }
    },
    wrapperStyles () {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        position: 'absolute',
        backgroundColor: '#666'
      }
    }
  },
  methods: {
    closeHandler () {
      this.$emit('close')
      if (this.isMinimized) {
        this.minimizeTo = ''
        this.isMinimized = false
      }
      if (this.isMaximized) {
        this.isMaximized = false
      }
    },
    maximizeHandler () {
      this.prevWidth = this.width
      this.prevHeight = this.height
      this.prevX = this.x
      this.prevY = this.y
      this.maximize()
    },
    minimizeHandler (type) {
      this.prevWidth = this.width
      this.prevHeight = this.height
      this.isMinimized = true
      this.minimizeTo = type
      if (this.isMaximized) {
        this.isMaximized = false
      }
    },
    restoreHandler () {
      this.isMinimized = false
      this.isMaximized = false
      this.minimizeTo = ''
      this.x = this.prevX || 50
      this.y = this.prevY || 50
      this.width = this.prevWidth || 500
      this.height = this.prevHeight || 520
      this.calculateViewModel()
    },
    minimize (minimizeTo) {
      const parentW = this.wrapperSize.width,
        parentH = this.wrapperSize.height
      this.width = 300
      this.height = parentH - 50
      switch (minimizeTo) {
        case 'left': {
          this.$nextTick(() => {
            this.x = parentW - 300
            this.y = parentH - this.height
          })
          break
        }
        case 'right': {
          this.$nextTick(() => {
            this.x = 0
            this.y = 50
          })
          break
        }
      }
    },
    maximize () {
      const parentW = this.wrapperSize.width,
        parentH = this.wrapperSize.height
      this.width = parentW
      this.height = parentH
      this.$nextTick(() => {
        this.x = 0
        this.y = 0
      })
      if (this.isMinimized) {
        this.minimizeTo = ''
        this.isMinimized = false
      }
      this.isMaximized = true
    },
    resizeHandler (left, top, width, height) {
      this.width = width
      this.height = height
      this.calculateViewModel()
    },
    onWindowResize (size) {
      this.$refs.dragResize.checkParentSize()
      if (this.isMinimized) {
        this.minimize(this.minimizeTo)
      } else if (this.isMaximized) {
        this.maximize()
      } else {
        if (this.wrapperSize.width > size.width) {
          let left = this.x,
            diffX = this.wrapperSize.width - size.width
          if (left + this.width >= this.wrapperSize.width - 30) {
            if (left) {
              left -= diffX
              if (left < 0) {
                diffX = left * -1
                left = 0
              }
              this.x = left
            }
            if (left === 0) {
              this.width -= diffX
              if (this.width < 100) {
                this.width = 100
              }
            }
          }
        }
        if (this.wrapperSize.height > size.height) {
          let top = this.y,
            diffY = this.wrapperSize.height - size.height
          if (top + this.height >= this.wrapperSize.height - 30) {
            if (top) {
              top -= diffY
              if (top < 0) {
                diffY = top * -1
                top = 0
              }
              this.x = top
            }
            if (top === 0) {
              this.height -= diffY
              if (this.height < 100) {
                this.height = 100
              }
            }
          }
        }
      }
      this.calculateViewModel()
    },
    draggingHandler (left, top) {
      if (this.isMinimized) {
        this.minimizeTo = ''
        this.isMinimized = false
      }
      if (this.isMaximized) {
        this.isMaximized = false
      }
      this.x = left
      this.y = top
      this.$emit('dragging')
      this.calculateViewModel()
    },
    applyViewModel (model) {
      if (!model) { return false }
      if (model.type === 'minimized' && !this.isMinimized) {
        this.minimizeHandler(model.to)
      } else if (model.type === 'maximized' && !this.isMaximized) {
        this.maximizeHandler()
      } else if (model.type === 'windowed') {
        this.x = model.x
        this.y = model.y
        this.width = model.width
        this.height = model.height
      }
    }
  },
  mounted () {
    if (this.$q.platform.is.mobile) { this.maximizeHandler() }
    this.applyViewModel(this.viewModel)
  },
  created () {
    this.calculateViewModel = debounce(() => {
      const model = {}
      if (this.isMinimized) {
        model.type = 'minimized'
        model.to = this.minimizeTo
      } else if (this.isMaximized) {
        model.type = 'maximized'
      } else {
        model.type = 'windowed'
        model.x = this.x
        model.y = this.y
        model.width = this.width
        model.height = this.height
      }
      this.$emit('change-view-model', model)
    }, 150)
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
    wrapperSize (size) {
      this.onWindowResize(size)
    },
    viewModel (model) {
      this.applyViewModel(model)
    }
  },
  components: { VueDraggableResizable }
}
</script>

<style lang="stylus">
  .widget__wrapper
    z-index 1
    .widget__header
      cursor move
      padding-right 1px
      padding-top 3px
    .widget__custom-controls
      position absolute
      top 13px
      right 3px
      z-index 999
      background rgba(100,100,100,.4)
      border-radius 5px
    &.widget--pinned
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
      border-left 1px solid $grey-8
    .handle-ml
      left 0
      cursor w-resize
      border-right 1px solid $grey-8
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
      border-bottom 1px solid $grey-8
    .handle-bm
      bottom 0
      cursor s-resize
      border-top 1px solid $grey-8
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
