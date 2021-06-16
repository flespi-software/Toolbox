<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" @click="itemClickHandler(index, clearItem)">
    <div
      class="cursor-pointer"
      :class="[item['x-flespi-status'] ? 'missed-items' : '', highlighted ? 'bg-purple-9' : '']"
      :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, backgroundColor: selected ? 'rgba(255,255,255,0.7)': '', color: selected && !highlighted ? '#333' : ''}"
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
    'rowWidth',
    'selected',
    'highlighted',
    'menuCellActive'
  ],
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
        result[key] = this.item[key]
        return result
      }, {})
    }
  },
  methods: {
    clickHandler (index, type, content) {
      this.$emit('action', { index, type, content })
    },
    itemClickHandler (index, content) {
      this.$emit('item-click', { index, content })
    },
    getValueOfProp (prop, item) {
      const propName = prop.name
      let value = item[propName]
      if (propName.match(/timestamp$/) || propName === 'begin' || propName === 'end') {
        value = date.formatDate(value * 1000, 'DD/MM/YYYY HH:mm:ss')
      } else if (propName.indexOf('image.bin.') !== -1) {
        value = '<binary image>'
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
