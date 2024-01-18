<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" @click="event => itemClickHandler(index, item, event)">
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
          :title="(values[prop.name].value || '') + (highlightDescription ? `\n${highlightDescription} ${highlightExplanation?'(' + highlightExplanation + ')' : ''}` : '')"
        >
          {{values[prop.name].value}}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

import highlightMessage from '../highlightMessageMixin.js'

export default {
  props: [
    'item',
    'index',
    'actions',
    'cols',
    'itemHeight',
    'rowWidth',
    'selected',
    'menuCellActive'
  ],
  mixins: [ highlightMessage ],
  data () {
    return {
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
          if (propName.indexOf('image.bin.') !== -1) {
            vals.etc.value += `${propName}: <binary image>`
          } else {
            vals.etc.value += `${propName}: ${JSON.stringify(this.item[propName])}; `
          }
        }
      })
      return vals
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
      if (propName.match(/timestamp$/)) {
        value = date.formatDate(value * 1000, 'DD/MM/YYYY HH:mm:ss')
      } else if (propName.indexOf('image.bin.') !== -1 && value) {
        value = '<binary image>'
      } else if (typeof value !== 'string') {
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
</style>
