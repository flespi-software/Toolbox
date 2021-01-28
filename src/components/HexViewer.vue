<template>
  <div @click="clearSelectedHandler" ref="wrapper">
    <q-menu context-menu>
      <q-list v-if="hex" separator style="min-width: 150px; max-height: 300px;">
        <q-item v-close-popup @click="copy('hex')" clickable>
          <q-item-section>Copy as hex</q-item-section>
        </q-item>

        <q-item v-close-popup @click="copy('text')" clickable>
          <q-item-section>Copy as raw</q-item-section>
        </q-item>

        <q-item v-close-popup @click="copy('view')" clickable>
          <q-item-section>Copy as seen</q-item-section>
        </q-item>

        <q-item v-close-popup @click="exportData('hex')" clickable>
          <q-item-section>Export as hex</q-item-section>
        </q-item>

        <q-item v-close-popup @click="exportData('text')" clickable>
          <q-item-section>Export as raw</q-item-section>
        </q-item>

        <q-item v-close-popup @click="exportData('view')" clickable>
          <q-item-section>Export as seen</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <div class="text-white hex-viewer" :style="{wordBreak: view === 'text' ? 'break-all' : ''}" v-if="hex" @click="selectAllHandler">
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
import range from 'lodash/range'
import chunk from 'lodash/chunk'
import { copyToClipboard } from 'quasar'
import convert from '../mixins/convert'
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
    bytesArray () {
      let bytesArray
      if (this.view === 'hex') {
        const bytes16Array = this.hex.match(/.{1,32}/g)
        bytesArray = bytes16Array.map(byte16 => byte16.match(/.{1,2}/g))
      } else if (this.view === 'text') {
        bytesArray = this.hex.match(/.{1,2}/g)
      }
      return bytesArray
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
  watch: {
    hex () {
      this.start = -1
      this.end = -1
    }
  },
  mixins: [convert],
  methods: {
    isEmptySymbol (byte) {
      const number = parseInt(byte, 16)
      if (number < 0x20 || number >= 0x7f) {
        return true
      } else {
        return false
      }
    },
    replaceByteWithDot (byte) {
      const number = parseInt(byte, 16),
        string = String.fromCharCode(number)
      if (number < 0x20 || number >= 0x7f) {
        return '.'
      } else {
        return string
      }
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
    getContent (type, onlyBySelection) {
      let content = ''
      switch (type) {
        case 'hex': {
          if (onlyBySelection && this.selected.length) {
            const byteArray = this.hex.match(/.{1,2}/g)
            content = this.selected.map(index => byteArray[index]).join('')
          } else {
            content = this.hex
          }
          break
        }
        case 'text': {
          const bytesHexArray = this.hex.match(/.{1,2}/g)
          const byteArray = onlyBySelection && this.selected.length ? this.selected.map(index => bytesHexArray[index]) : bytesHexArray
          content = byteArray.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('')
          break
        }
        case 'view': {
          if (this.view === 'text') {
            const byteArray = onlyBySelection && this.selected.length ? this.selected.map(index => this.bytesArray[index]) : this.bytesArray
            content = byteArray.map((byte) => {
              let str = this.replaceByteWithMnemo(byte)
              if (byte === '0A') {
                str += '\n'
              }
              return str
            }).join('')
          } else {
            const isSelectionMode = onlyBySelection && this.selected.length,
              allIndexes = chunk(Object.keys(this.hex.match(/.{1,2}/g)), 16),
              indexes = isSelectionMode ? allIndexes.reduce((indexes, row) => {
                let isRowEmpty = true
                const localRow = row.reduce((currentRow, byteIndex, index) => {
                  if (byteIndex < this.selected[0] || byteIndex > this.selected[this.selected.length - 1]) {
                    currentRow.push(null)
                  } else {
                    currentRow.push(byteIndex)
                    isRowEmpty = false
                  }
                  if (index === row.length - 1) {
                    currentRow = isRowEmpty ? null : currentRow
                  }
                  return currentRow
                }, [])
                indexes.push(localRow)
                return indexes
              }, []) : allIndexes
            indexes.forEach((row, index) => {
              if (!row) { return false }
              content += `${this.addresses[index].toString(16).padStart(7, 0).toUpperCase()}   `
              const currentBytesArray = this.bytesArray[index]
              let hexView = '',
                textView = ''
              row.forEach((index, byteIndex) => {
                if (!index) {
                  hexView += '  '
                  textView += ' '
                } else {
                  hexView += currentBytesArray[byteIndex]
                  textView += this.replaceByteWithDot(currentBytesArray[byteIndex])
                }
                hexView += ' '
              })
              content += hexView
              content += '   '
              content += ''.padEnd(32 - row.length * 2, ' ')
              content += ''.padEnd(16 - row.length, ' ')
              content += textView
              content += '\n'
            })
          }
          break
        }
      }
      return content
    },
    copy (type) {
      const content = this.getContent(type, true)

      copyToClipboard(content).then((e) => {
        this.$q.notify({
          type: 'positive',
          icon: 'content_copy',
          message: `${type} copied`,
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          type: 'negative',
          icon: 'content_copy',
          message: `Error coping ${type}`,
          timeout: 1000
        })
      })
    },
    exportData (type) {
      const typeOfFile = type === 'hex' ? 'application/octet-stream' : 'text/plain',
        link = document.createElement('a'),
        content = this.getContent(type, true),
        blob = new Blob([content], { type: typeOfFile }),
        data = URL.createObjectURL(blob)
      link.setAttribute('href', data)
      link.setAttribute('download', 'data.txt')
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
