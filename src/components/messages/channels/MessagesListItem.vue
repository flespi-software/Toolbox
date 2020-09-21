<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}">
    <div
      v-if="!item['__connectionStatus']"
      @click="event => itemClickHandler(index, clearItem, event)"
      class="cursor-pointer"
      :class="[item['x-flespi-status'] ? 'missed-items' : '', selected ? 'bg-white-opasity' : highlightLevel ? `text-${highlightType}-${highlightLevel}` : '']"
      :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, color: selected ? '#333' : ''}"
    >
      <template v-for="(prop, k) in cols">
        <span class="list__item item_actions" :class="{[`item_${k}`]: true}" v-if="prop.__dest === 'action'" :key="prop.name + k">
          <q-icon v-for="(action, i) in renderedActions" :key="i" @click.stop.native="clickHandler(index, action.type, clearItem)"
                  :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
            <q-tooltip>{{action.label}}</q-tooltip>
          </q-icon>
        </span>
        <span v-else-if="prop.__dest === 'etc'" class="list__item item_etc" :class="{[`item_${k}`]: true}" :key="prop.name + k">{{values.etc.value || '*Empty*'}}</span>
        <span
          v-else
          :key="prop.name + k"
          class="list__item"
          :class="{[`item_${k}`]: true}"
          :title="values[prop.name].value"
        >
          {{values[prop.name].value}}
        </span>
      </template>
    <span v-if="etcVisible" class="list__item item_etc">
      {{values.etc.value || '*Empty*'}}
    </span>
    </div>
    <div
      v-else
      :style="{
      height: `${itemHeight}px`,
      width: `${rowWidth}px`,
      border: 'solid 1px #000',
      color: '#000',
      fontWeight: 'bold',
      backgroundColor: item.__connectionStatus === 'offline' ? '#ff0' : '#0f0',
      backgroundImage: 'url(./statics/police.png)',
      overflow: 'hidden',
      opacity: '.7'
    }"
      :title="date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')"
    >
    <span style="padding: 0 5px; margin-left: 150px;" :style="{ backgroundColor: item.__connectionStatus === 'offline' ? '#ff0' : '#0f0'}" class="text-uppercase" v-for="n in Array(10)" :key="n">
      {{item['__connectionStatus']}}
    </span>
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
    'selected'
  ],
  data () {
    let highlightLevel = 0,
      highlightType = ''
    if (this.item.timestamp < this.item['server.timestamp'] - 1800) { // >30min
      highlightType = 'orange'
      highlightLevel = 10
    } else if (this.item.timestamp < this.item['server.timestamp'] - 600) { // 10-30min
      highlightType = 'orange'
      highlightLevel = 7
    } else if (this.item.timestamp < this.item['server.timestamp'] - 120) { // 2-10min
      highlightType = 'orange'
      highlightLevel = 4
    } else if (this.item.timestamp - 1 > this.item['server.timestamp']) { // < 1sec-1min
      highlightType = 'grey'
      highlightLevel = 6
    } else if (this.item.timestamp - 60 > this.item['server.timestamp']) { // 1-30min
      highlightType = 'grey'
      highlightLevel = 8
    } else if (this.item.timestamp - 1800 > this.item['server.timestamp']) { // >30min
      highlightType = 'grey'
      highlightLevel = 10
    }
    const renderedActions = [...this.actions]
    if (this.item['position.latitude'] && this.item['position.longitude']) {
      renderedActions.push(
        {
          icon: 'mdi-map',
          label: 'show on map',
          classes: '',
          type: 'map'
        }
      )
    }
    return {
      highlightType,
      highlightLevel,
      date: date,
      renderedActions
    }
  },
  computed: {
    values () {
      let vals = {}
      if (this.cols.length) {
        vals = this.cols.reduce((res, col, index, arr) => {
          res[col.name] = { value: null }
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
        if (propName.indexOf('#') !== -1) {
          const splitedName = propName.split('#'),
            name = splitedName[0],
            index = splitedName[1]
          if (vals[name]) {
            if (!vals[name].value) {
              vals[name].value = {}
            } else if (typeof vals[name].value !== 'object') {
              const value = vals[name].value
              vals[name].value = { [index - 1]: value }
            }
            vals[name].value[index] = JSON.stringify(this.item[propName])
          } else {
            vals.etc.value += `${propName}: ${JSON.stringify(this.item[propName])}; `
          }
        } else if (vals[propName]) {
          let value = this.item[propName]
          if (propName.indexOf('image.bin.') !== -1) {
            value = '<binary image>'
          } else if (propName.indexOf('proxy.event') !== -1) {
            value = value === 0 ? 'data received' : value === 1 ? 'connected' : 'disconnect'
          } else if (propName.indexOf('proxy.source') !== -1) {
            value = value === 0 ? 'channel incoming connection' : `target ${value}`
          } else if (propName.match(/timestamp$/)) {
            value = date.formatDate(value * 1000, 'DD/MM/YYYY HH:mm:ss')
          }
          if (typeof value === 'string') {
            vals[propName].value = value
          } else {
            vals[propName].value = JSON.stringify(value)
          }
        } else {
          if (propName.indexOf('x-flespi') !== -1) { return false }
          if (propName.indexOf('image.bin.') !== -1) {
            vals.etc.value += `${propName}: <binary image>`
          } else {
            vals.etc.value += `${propName}: ${JSON.stringify(this.item[propName])}; `
          }
        }
      })
      Object.keys(vals).forEach((key) => {
        if (typeof vals[key].value === 'object' && vals[key].value) {
          if (vals[key].value instanceof Array) {
            const buff = vals[key].value.reduce((acc, item, index, arr) => {
              acc += item
              if (index !== arr.length - 1) {
                acc += ', '
              }
              return acc
            }, '')
            vals[key].value = buff
          } else if (vals[key].value instanceof Object) {
            const buff = Object.keys(vals[key].value).reduce((acc, name, index, arr) => {
              acc += `${name}: ${vals[key].value[name]}`
              if (index !== arr.length - 1) {
                acc += ', '
              }
              return acc
            }, '')
            vals[key].value = buff
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
    }
  }
}
</script>

<style lang="stylus">
  .bg-white-opasity
    background-color rgba(255, 255, 255, .7)
  .list__item
    display inline-block
    white-space nowrap
    margin 0 10px 0 5px
    text-overflow ellipsis
    overflow hidden
  .message-viewer .q-w-list>.missed-items
    background-color rgba(255,255,255,.05)
    &:nth-child(odd)
      background-color rgba(255,255,255,.1)
</style>
