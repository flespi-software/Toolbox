<template>
  <div @click="clearSelectedHandler" ref="wrapper">
    <q-menu context-menu no-route-dismiss>
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
      <q-menu v-if="highlightIndex > -1" :target="`.highlighted.byte-${highlightIndex}`" :value="true" no-parent-event no-route-dismiss>
        <div class="bg-grey-8 q-pa-xs text-caption">
          <pre v-for="textModel in highlightTexts" :key="textModel.text" class="q-ma-none text-white text-pre">{{textModel.text}}</pre>
        </div>
      </q-menu>
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
              class="q-pr-xs q-pl-xs q-pt-xs q-pb-xs"
              :class="getClassesByByteIndex((row * 16) + index)"
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
              class="q-pr-xs q-pl-xs q-pt-xs q-pb-xs hex-char"
              :class="getClassesByByteIndex((row * 16) + index)"
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
          :class="{
            ...getClassesByByteIndex(index),
            'raw-hex-data': isEmptySymbol(byte)
          }"
          :key="`${index}${byte}`"
        >{{replaceByteWithMnemo(byte)}}<br v-if="byte === '0A'"/></span>
      </template>
    </div>
    <div v-else style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" >No HEX data</div>
  </div>
</template>

<style lang="stylus">
  .text-pre
    white-space pre-wrap
    word-break break-word
  .raw-hex-data
    font-size 0.8rem
    font-family initial
    border-radius 2px
    background-color #555
    color #ccc
    padding 0 2px
  .hex-char, .text-char
    white-space pre
  .selected--basic
    color rgb(51, 51, 51)
    background-color rgba(255, 255, 255, 0.7) !important
  .selected--error
    color rgb(51, 51, 51)
    background-color rgba(244, 67, 54, 0.7)
  .selected--hovered
    color rgb(51, 51, 51)
    background-color rgba(255, 255, 255, 0.4)
  .hex-viewer
    padding 10px 10px
    margin 0 auto
    width 820px
    font-family 'PT Mono',monospace
    font-size 14.5px
    line-height 22px
    user-select none
    cursor default
    font-variant normal
    text-transform none
    -webkit-font-smoothing antialiased
    .hex-viewer__addresses
      width 80px
      display inline-block
      div
        overflow hidden
    .hex-viewer__value
      width 420px
      display inline-block
      div
        overflow hidden
    .hex-viewer__text
      width: 300px
      display inline-block
      div
        overflow hidden
</style>

<script>
import get from 'lodash/get'
/*
  highlight = {
    start: number,
    end: number,
    type: 'error'|'warning'|'basic',
    text: string
  }
*/
import hexProcessing from '../mixins/hexProcessing'

export default {
  name: 'HexViewer',
  props: {
    hex: String,
    view: String,
    highlights: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    const highlightIndex = get(this.highlights[0], 'start', -1)
    return {
      hovered: -1,
      start: -1,
      end: -1,
      selectionMode: false,
      timer: 0,
      clicks: 0,
      highlightIndex
    }
  },
  computed: {
    bytesArray () { return this.getBytesArray(this.hex, this.view) },
    addresses () { return this.getAddresses(this.hex) },
    selected () { return this.getSelected(this.start, this.end) },
    highlighted () {
      return this.highlights.reduce((highlights, highlight) => {
        const range = this.getSelected(highlight.start, highlight.end)
        const res = highlights[highlight.type]
        range.forEach(index => {
          if (!res[index]) {
            res[index] = []
          }
          res[index].push(highlight.text)
        })
        return highlights
      }, {
        error: {},
        warning: {},
        basic: {}
      })
    },
    highlightTexts () {
      const texts = []
      if (this.highlights.length) {
        const hovered = this.highlightIndex
        const types = ['error', 'warning', 'basic']
        types.forEach((type) => {
          if (this.highlighted[type][hovered]) {
            this.highlighted[type][hovered].forEach(text => {
              texts.push({ text, type })
            })
          }
        })
      }
      return texts
    }
  },
  watch: {
    hex () {
      this.start = -1
      this.end = -1
    },
    selected (val) {
      this.$emit('selectedBytes', this.start !== -1 && this.end !== -1 ? this.getContent('hex', this.hex, this.view, val) : '')
    }
  },
  mixins: [hexProcessing],
  methods: {
    getClassesByByteIndex (index) {
      const classes = {
        'selected--basic': this.selected.includes(index),
        'highlighted': this.highlighted.error[index] || this.highlighted.warning[index],
        'selected--error': this.highlighted.error[index],
        'selected--hovered': (this.hovered === index) || (this.start === this.end === index),
        [`byte-${index}`]: true
      }
      return classes
    },
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
        this.hovered = row ? (row * 16) + col : col
        this.setHighlightIndex(this.hovered)
      }
    },
    setHighlightIndex (index) {
      if (
        this.highlighted.error[index] ||
        this.highlighted.warning[index] ||
        this.highlighted.basic[index]
      ) {
        this.highlightIndex = index
      } else {
        this.highlightIndex = -1
      }
    },
    selectAllHandler () {
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0
        }, 500)
      } else {
        clearTimeout(this.timer)
        this.clicks = 0
        if (this.selected.length <= 1) {
          this.start = 0
          this.end = this.hex.match(/.{1,2}/g).length - 1
        } else{
          this.start = -1
          this.end = -1
        }
      }
    },
    mouseLeaveHandler () {
      this.hovered = -1
      this.highlightIndex = -1
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
