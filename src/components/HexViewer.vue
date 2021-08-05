<template>
  <div @click="clearSelectedHandler" ref="wrapper">
    <q-menu context-menu>
      <q-list style="min-width: 100px" class="bg-grey-8 text-white">
        <div class="q-pa-sm">
          <div style="font-size: .8rem">Copy as</div>
          <div>
            <q-btn v-close-popup dense flat label="shown" @click="copy(getContent('view', hex, view, selected), 'view')" />
            <q-btn v-close-popup dense flat label="hex" @click="copy(getContent('hex', hex, view, selected), 'hex')" />
            <q-btn v-close-popup dense flat label="raw" @click="copy(getContent('text', hex, view, selected), 'text')" />
          </div>
        </div>
        <q-separator />
        <div class="q-pa-sm">
          <div style="font-size: .8rem">Export as</div>
          <div>
            <q-btn v-close-popup dense flat label="shown" @click="exportData(getContent('view', hex, view, selected), 'view')" />
            <q-btn v-close-popup dense flat label="hex" @click="exportData(getContent('hex', hex, view, selected), 'hex')" />
            <q-btn v-close-popup dense flat label="raw" @click="exportData(getContent('text', hex, view, selected), 'text')" />
          </div>
        </div>
      </q-list>
    </q-menu>
    <div class="text-white hex-viewer" :style="{wordBreak: view === 'text' ? 'break-all' : ''}" v-if="hex" @click="selectAllHandler" @mouseover="wrapperMouseOverHandler">
      <template v-if="view === 'hex'">
        <div class="hex-viewer__addresses">
          <div v-for="address in addresses" :key='address'>{{address.toString(16).padStart(7, 0).toUpperCase()}}</div>
        </div>
        <div @mouseleave="mouseLeaveHandler" class="hex-viewer__value">
          <div v-for="(byte16, row) in bytesArray" :key="row + byte16">
            <span
              @mouseover="setActiveHandler(row, index)"
              @mousedown="event => startSelectionHandler(event, row, index)"
              @mouseup="event => endSelectionHandler(event, row, index)"
              class="q-pr-xs q-pl-xs q-mt-sm q-mb-sm"
              :class="{'selected': (selected.includes((row * 16) + index)), '--active': (active === (row * 16) + index) || (start === end === ((row * 16) + index))}"
              v-for="(byte, index) in byte16"
              :key="`${row}${index}${byte}`"
            >{{byte}}</span>
          </div>
        </div>
        <div @mouseleave="mouseLeaveHandler" class="hex-viewer__text">
          <div v-for="(byte16, row) in bytesArray" :key="row + byte16">
            <span
              @mouseover="setActiveHandler(row, index)"
              @mousedown="event => startSelectionHandler(event, row, index)"
              @mouseup="event => endSelectionHandler(event, row, index)"
              class="q-pr-xs q-pl-xs q-mt-sm q-mb-sm hex-char"
              :class="{ 'selected': (selected.includes((row * 16) + index)), '--active': (active === (row * 16) + index) || (start === end === ((row * 16) + index))}"
              v-for="(byte, index) in byte16"
              :key="`${row}${index}${byte}`"
            >{{replaceByteWithDot(byte)}}</span>
          </div>
        </div>
      </template>
      <template v-else-if="view === 'text'">
        <span
          v-for="(byte, index) in bytesArray"
          @mouseover="setActiveHandler(null, index)"
          @mousedown="event => startSelectionHandler(event, null, index)"
          @mouseup="event => endSelectionHandler(event, null, index)"
          class="q-mt-sm q-mb-sm text-char"
          :class="{ 'selected': (selected.includes(index)), '--active': (active === index) || (start === end === index), 'raw-hex-data': isEmptySymbol(byte)}"
          :key="`${index}${byte}`"
        >{{replaceByteWithMnemo(byte)}}<br v-if="byte === '0A'"/></span>
      </template>
    </div>
    <div v-else style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" >No HEX data</div>
  </div>
</template>

<style lang="stylus">
  .raw-hex-data
    font-size 0.8rem
    font-family initial
    border-radius 2px
    background-color #555
    color #ccc
    padding 0 2px
  .hex-char, .text-char
    white-space pre
  .selected
    color rgb(51, 51, 51)
    background-color rgba(255, 255, 255, 0.7)
  .--active
    color rgb(51, 51, 51)
    background-color rgba(255, 255, 255, 0.4)
  .hex-viewer
    padding 10px 10px
    margin 0 auto
    width 820px
    font-family 'PT Mono',monospace
    font-size 14.5px
    user-select none
    cursor default
    font-variant normal
    text-transform none
    -webkit-font-smoothing antialiased
    .hex-viewer__addresses
      width 80px
      display inline-block
    .hex-viewer__value
      width 420px
      display inline-block
    .hex-viewer__text
      width: 300px
      display inline-block
</style>

<script>
import hexProcessing from '../mixins/hexProcessing'
export default {
  name: 'HexViewer',
  props: ['hex', 'view'],
  data () {
    return {
      active: -1,
      start: -1,
      end: -1,
      selectionMode: false,
      timer: 0,
      clicks: 0
    }
  },
  computed: {
    bytesArray () { return this.getBytesArray(this.hex, this.view) },
    addresses () { return this.getAddresses(this.hex) },
    selected () { return this.getSelected(this.start, this.end) }
  },
  watch: {
    hex () {
      this.start = -1
      this.end = -1
    }
  },
  mixins: [hexProcessing],
  methods: {
    clearSelectedHandler (e) {
      if (e.target.isEqualNode(this.$refs.wrapper) && !this.selectionMode) {
        this.start = -1
        this.end = -1
      }
      if (this.selectionMode) {
        this.selectionMode = false
      }
    },
    startSelectionHandler (event, row, col) {
      if (event.which === 3) { return false }
      if (this.end !== -1) { this.end = -1 }
      this.selectionMode = true
      this.start = row ? (row * 16) + col : col
    },
    endSelectionHandler (event, row, col) {
      if (event.which === 3) { return false }
      this.end = row ? (row * 16) + col : col
      this.selectionMode = false
    },
    setActiveHandler (row, col) {
      if (this.selectionMode) {
        this.end = row ? (row * 16) + col : col
      } else {
        this.active = row ? (row * 16) + col : col
      }
    },
    selectAllHandler () {
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0
        }, 700)
      } else {
        clearTimeout(this.timer)
        this.clicks = 0
        this.start = 0
        this.end = this.hex.match(/.{1,2}/g).length - 1
      }
    },
    mouseLeaveHandler () {
      this.active = -1
      if (this.selectionMode && this.$q.platform.is.desktop) {
        this.end = this.hex.match(/.{1,2}/g).length - 1
      }
    },
    scrollingTo (direction) {
      if (this.scrollingId) { return false }
      this.scrollingId = setInterval(() => {
        if (!this.selectionMode) { this.clearSCrolling() }
        if (direction === 'top') {
          this.$refs.wrapper.scrollTop -= 5
        } else if (direction === 'bottom') {
          this.$refs.wrapper.scrollTop += 5
        }
      }, 100)
    },
    clearSCrolling () {
      clearInterval(this.scrollingId)
      this.scrollingId = undefined
    },
    wrapperMouseOverHandler (e) {
      if (this.selectionMode) {
        const wrapperHeight = this.$refs.wrapper.offsetHeight
        const minLevelWithoutAutoScrolling = wrapperHeight / 20
        const maxLevelWithoutAutoScrolling = wrapperHeight - minLevelWithoutAutoScrolling
        const currentLevel = e.layerY
        if (currentLevel < minLevelWithoutAutoScrolling) {
          this.scrollingTo('top')
        } else if (currentLevel > maxLevelWithoutAutoScrolling) {
          this.scrollingTo('bottom')
        } else {
          this.clearSCrolling()
        }
      }
    }
  }
}
</script>
