<template>
  <div class="text-white hex-viewer" v-if="hex">
    <div class="hex-viewer__addresses">
      <div v-for="address in addresses" :key='address'>{{address.toString(16).padStart(7, 0).toUpperCase()}}</div>
    </div>
    <div @mouseleave="mouseLeaveHandler" class="hex-viewer__value">
      <div v-for="(byte16, row) in bytesArray" :key="row + byte16">
        <span
          @mouseover="setActiveHandler(row, index)"
          @mousedown="startSelectionHandler(row, index)"
          @mouseup="endSelectionHandler(row, index)"
          class="q-pr-xs q-pl-xs q-mt-sm q-mb-sm"
          :class="{'selected': (selected.includes((row * 16) + index)), 'active': (active === (row * 16) + index) || (start === end === ((row * 16) + index))}"
          v-for="(byte, index) in byte16"
          :key="`${row}${index}${byte}`"
        >{{byte}}</span>
      </div>
    </div>
    <div @mouseleave="mouseLeaveHandler" class="hex-viewer__text">
      <div v-for="(byte16, row) in bytesArray" :key="row + byte16">
        <span
          @mouseover="setActiveHandler(row, index)"
          @mousedown="startSelectionHandler(row, index)"
          @mouseup="endSelectionHandler(row, index)"
          class="q-pr-xs q-pl-xs q-mt-sm q-mb-sm"
          :class="{ 'selected': (selected.includes((row * 16) + index)), 'active': (active === (row * 16) + index) || (start === end === ((row * 16) + index))}"
          v-for="(byte, index) in byte16"
          :key="`${row}${index}${byte}`"
        >{{String.fromCharCode(parseInt(byte, 16)).replace(/\s/g, '.')}}</span>
      </div>
    </div>
  </div>
  <div v-else style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" >No HEX data</div>
</template>

<style lang="stylus">
  .selected
    color rgb(51, 51, 51)
    background-color rgba(255, 255, 255, 0.7)
  .active
    color rgb(51, 51, 51)
    background-color rgba(255, 255, 255, 0.4)
  .hex-viewer
    padding 10px 10px
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
import range from 'lodash/range'
export default {
  name: 'HexViewer',
  props: ['hex'],
  data () {
    return {
      active: -1,
      start: -1,
      end: -1,
      selectionMode: false
    }
  },
  computed: {
    bytesArray () {
      let bytes16Array = this.hex.match(/.{1,32}/g)
      return bytes16Array.map(byte16 => byte16.match(/.{1,2}/g))
    },
    addresses () { return range(0x00, 0x10 * this.hex.match(/.{1,32}/g).length, 0x10) },
    selected () {
      if (this.start !== -1 && this.end !== -1) {
        if (this.start > this.end) {
          return range(this.end, this.start + 1)
        } else {
          return range(this.start, this.end + 1)
        }
      }
      return []
    }
  },
  methods: {
    startSelectionHandler (row, col) {
      if (this.end !== -1) { this.end = -1 }
      this.selectionMode = true
      this.start = (row * 16) + col
    },
    endSelectionHandler (row, col) {
      this.end = (row * 16) + col
      this.selectionMode = false
    },
    setActiveHandler (row, col) {
      if (this.selectionMode) {
        this.end = (row * 16) + col
      } else {
        this.active = (row * 16) + col
      }
    },
    mouseLeaveHandler () {
      this.active = -1
      if (this.selectionMode) {
        this.start = -1
        this.end = -1
        this.selectionMode = false
      }
    }
  }
}
</script>
