<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" @click="event => itemClickHandler(index, item, event)">
    <div
      class="cursor-pointer"
      :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, boxSizing: 'border-box'}"
      :class="[color, item['x-flespi-status'] ? 'missed-items' : '', selected ? 'bg-white-opasity-3' : '']"
    >
      <template v-for="(prop, k) in cols">
        <span v-if="prop.__dest === 'etc'" class="list__item item_etc" :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}" :key="prop.name + k">{{etc}}</span>
        <span
          v-else
          :key="prop.name + k"
          class="list__item"
          :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}"
        >
          <!--<q-tooltip>{{getLogValueOfProp(prop, item)}}</q-tooltip>-->
          <!-- <a :class="[color]" @click.prevent.stop="linkMoreClickHandler" v-if="prop.name === 'event_code'"><q-icon name="mdi-open-in-new"/></a> -->
          <template v-if="prop.name === 'event_code' && item.address">
            <q-icon v-if="item.address === 'connection'" name="mdi-ethernet" title="address: connection"/>
            <q-icon v-if="item.address === 'sms'" name="mdi-email-outline"  title="address: sms"/>
            <q-icon v-if="item.address === 'local'" name="mdi-content-save-outline"  title="address: local"/>
          </template>
          <q-icon name="mdi-alert-outline" v-if="prop.name === 'event_code' && !!item['error_text']" @click.stop.native="clickHandler(index, 'to-error-traffic', item)"><q-tooltip><pre class="q-ma-none">{{item['error_text']}}</pre></q-tooltip></q-icon>
          <q-icon name="mdi-bug" v-if="prop.name === 'event_code' && isErrorType && isIntegration" @click.stop.native="clickHandler(index, 'error-report', item)"><q-tooltip>Report error to chat</q-tooltip></q-icon>
          <a @click.stop="" target="_blank" class="text-green" v-if="item.event_code === 901 && prop.name === 'name'" :href="`${$flespiCDN}/file/${item.uuid}`">
            {{getLogValueOfProp(prop, item)}}
          </a>
          <span v-else :title="JSON.stringify(getLogValueOfProp(prop, item))">
            {{getLogValueOfProp(prop, item)}}
          </span>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { date, openURL, Platform } from 'quasar'
import ItemMixin from './ItemMixin'

export default {
  props: [
    'item',
    'index',
    'actions',
    'cols',
    'itemHeight',
    'selected',
    'rowWidth',
    'itemSettings',
    'menuCellActive'
  ],
  mixins: [ItemMixin],
  data () {
    return {
      date,
      isIntegration: Platform.within.iframe
    }
  },
  computed: {
    etc () {
      const etcKeys = Object.keys(this.item).filter(key => !this.hasInCols(key))
      return etcKeys.reduce((acc, key) => {
        if (
          key === 'event_origin' ||
          key === 'event_text' ||
          key === 'item_data' ||
          key === 'source' ||
          key === 'error_text' ||
          key === 'close_code' ||
          key === 'code' ||
          key === 'http_data' ||
          key === 'current' ||
          key === 'updated' ||
          key === 'error_code' ||
          key === 'send_code' ||
          key === 'address' ||
          key === 'uuid'
        ) { return acc }
        acc += `${key}: ${JSON.stringify(this.item[key])}; `
        return acc
      }, '') || '*Empty*'
    },
    color () { return `text-${this.getLogItemColorByLogEntry(this.item)}` },
    isErrorType () {
      return this.color === 'text-red'
    },
    eventLinkMore () {
      const host = this.$flespiServer
      return `${host}/${this.getLogMeta(this.item).doc}`
    },
    description () {
      return this.getLogDescriptionByItem(this.item)
    },
  },
  methods: {
    hasInCols (prop) {
      return !!this.cols.filter(col => prop === col.name).length
    },
    clickHandler (index, type, content) {
      this.$emit('action', { index, type, content })
    },
    linkMoreClickHandler () {
      openURL(this.eventLinkMore)
    },
    itemClickHandler (index, content, event) {
      Object.defineProperty(content, 'x-flespi-description', {
        value: `<div style="font-size: 1.1rem">${content.event_code}: ${this.getLogDescriptionByItem(content)}</div><div style="font-size: .9rem">${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}</div>`,
        enumerable: false
      })
      Object.defineProperty(content, 'x-flespi-color', {
        value: `text-${this.getLogItemColorByLogEntry(content)}`,
        enumerable: false
      })
      this.$emit('item-click', { index, content, event })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .bg-white-opasity-3
    background-color rgba(255, 255, 255, .3)
  .list__item
    display inline-block
    height 19px
    white-space nowrap
    padding-left 5px
    text-overflow ellipsis
    overflow hidden
    border-right 2px solid $grey-8
    vertical-align text-bottom
  .item--active
    background-color $grey-1
  .message-viewer .q-w-list>.missed-items
    background-color rgba(255,255,255,.05)
    &:nth-child(odd)
      background-color rgba(255,255,255,.1)
</style>
