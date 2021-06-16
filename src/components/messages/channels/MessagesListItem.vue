<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" @click="event => itemClickHandler(index, clearItem, event)">
    <div
      class="cursor-pointer"
      :class="[item['x-flespi-status'] ? 'missed-items' : '', selected ? 'bg-white-opasity' : highlightLevel ? `text-${highlightType}-${highlightLevel}` : '']"
      :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, color: selected ? '#333' : ''}"
    >
      <template v-for="(prop, k) in cols">
        <span v-if="prop.__dest === 'etc'" class="list__item item_etc" :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}" :key="prop.name + k">{{values.etc.value || '*Empty*'}}</span>
        <span
          v-else
          :key="prop.name + k"
          class="list__item"
          :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}"
          :title="values[prop.name].value"
        >
          {{values[prop.name].value}}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  props: [
    'item',
    'index',
    'actions',
    'cols',
    'itemHeight',
    'etcVisible',
    'rowWidth',
    'actionsVisible',
    'selected',
    'menuCellActive'
  ],
  data () {
    let highlightLevel = 0,
      highlightType = ''
    if (this.item.timestamp < this.item['server.timestamp'] - 1800) { // >30min
      highlightType = 'grey'
      highlightLevel = 7
    } else if (this.item.timestamp < this.item['server.timestamp'] - 600) { // 10-30min
      highlightType = 'grey'
      highlightLevel = 6
    } else if (this.item.timestamp < this.item['server.timestamp'] - 120) { // 2-10min
      highlightType = 'grey'
      highlightLevel = 5
    } else if (this.item.timestamp - 1800 > this.item['server.timestamp']) { // >30min
      highlightType = 'orange'
      highlightLevel = 10
    } else if (this.item.timestamp - 60 > this.item['server.timestamp']) { // 1-30min
      highlightType = 'orange'
      highlightLevel = 7
    } else if (this.item.timestamp - 1 > this.item['server.timestamp']) { // < 1sec-1min
      highlightType = 'orange'
      highlightLevel = 4
    }
    return {
      highlightType,
      highlightLevel,
      date: date
    }
  },
  computed: {
    values () {
      let vals = {}
      if (this.cols.length) {
        vals = this.cols.reduce((res, col, index, arr) => {
          res[col.name] = { value: this.getValueOfProp(col, this.item) }
          if (index === arr.length - 1) {
            res.etc = { value: '' }
          }
          return res
        }, {})
      } else {
        vals = {
          etc: { value: '' }
        }
      }
      Object.keys(this.item).forEach((propName) => {
        if (!vals[propName]) {
          if (propName.indexOf('x-flespi') !== -1) { return false }
          if (propName.indexOf('image.bin.') !== -1) {
            vals.etc.value += `${propName}: <binary image>`
          } else {
            vals.etc.value += `${propName}: ${JSON.stringify(this.item[propName])}; `
          }
        }
      })
      return vals
    },
    clearItem () {
      return Object.keys(this.item).reduce((result, key) => {
        if (key.indexOf('x-flespi') !== -1) {
          return result
        }
        result[key] = this.item[key]
        return result
      }, {})
    }
  },
  methods: {
    clickHandler (index, type, content) {
      this.$emit('action', { index, type, content })
    },
    itemClickHandler (index, content, event) {
      this.$emit('item-click', { index, content, event })
    },
    getValueOfProp (prop, item) {
      const propName = prop.name
      let value = item[propName]
      if (propName.indexOf('image.bin.') !== -1) {
        value = '<binary image>'
      } else if (propName.indexOf('proxy.event') !== -1) {
        value = value === 0 ? 'data received' : value === 1 ? 'connected' : 'disconnect'
      } else if (propName.indexOf('proxy.source') !== -1) {
        value = value === 0 ? 'channel incoming connection' : `target ${value}`
      } else if (propName.match(/timestamp$/)) {
        value = date.formatDate(value * 1000, 'DD/MM/YYYY HH:mm:ss')
      }
      if (typeof value !== 'string') {
        value = JSON.stringify(value)
      }
      return value
    }
  }
}
</script>

<style lang="stylus" scoped>
  .bg-white-opasity
    background-color rgba(255, 255, 255, .7)
  .list__item
    display inline-block
    min-height 19px
    white-space nowrap
    padding-left 5px
    text-overflow ellipsis
    overflow hidden
    border-right 2px solid $grey-8
  .item--active
    background-color $grey-7
  .message-viewer .q-w-list>.missed-items
    background-color rgba(255,255,255,.05)
    &:nth-child(odd)
      background-color rgba(255,255,255,.1)
</style>
