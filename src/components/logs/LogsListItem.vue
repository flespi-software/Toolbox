<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" @click="itemClickHandler(index, clearItem)">
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
          <q-icon name="mdi-download-network-outline" v-if="prop.name === 'event_code' && !!item['error_text'] && needTrafficRoute" color="white" style="float: right; margin-top: 3px;" @click.stop.native="clickHandler(index, 'traffic', clearItem)"><q-tooltip>Show in traffic viewer</q-tooltip></q-icon>
          <q-icon name="mdi-alert-outline" v-if="prop.name === 'event_code' && !!item['error_text']"><q-tooltip><pre class="q-ma-none">{{item['error_text']}}</pre></q-tooltip></q-icon>
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
import { date, openURL } from 'quasar'
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
      date: date,
      needTrafficRoute: (this.itemSettings && this.itemSettings.needTrafficRoute) || !this.itemSettings
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
          key.indexOf('x-flespi') !== -1 ||
          key === 'uuid'
        ) { return acc }
        acc += `${key}: ${JSON.stringify(this.item[key])}; `
        return acc
      }, '') || '*Empty*'
    },
    color () { return `text-${this.getLogItemColor(this.item.event_code)}` },
    eventLinkMore () {
      const host = this.$flespiServer
      switch (this.item.event_code) {
        case 1:
        case 2:
        case 3: { return `${host}/docs/#/platform` }
        case 20:
        case 21: { return `${host}/docs/#/platform/!/counters` }
        case 100:
        case 101:
        case 102: { return `${host}/docs/#/gw/!/connections` }
        case 110:
        case 111:
        case 112:
        case 113: { return `${host}/docs/#/gw/!/commands` }
        case 103:
        case 114: { return `${host}/docs/#/gw/!/channels` }
        case 200:
        case 201:
        case 202:
        case 203:
        case 204: { return `${host}/docs/#/gw/!/modems` }
        case 300:
        case 301:
        case 302:
        case 303:
        case 304:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 315:
        case 316:
        case 317:
        case 320:
        case 321:
        case 322: { return `${host}/docs/#/gw/!/devices` }
        case 401:
        case 402:
        case 403:
        case 404:
        case 410:
        case 411:
        case 412:
        case 420:
        case 422:
        case 430:
        case 432: { return `${host}/docs/#/gw/!/streams` }
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 510:
        case 511:
        case 512: { return `${host}/docs/#/mqtt/!/sessions` }
        case 600: { return `${host}/docs/#/platform/!/tokens` }
        case 601:
        case 602:
        case 603:
        case 604:
        case 605: { return `${host}/docs/#/gw/!/calcs` }
        case 700: { return `${host}/docs/#/storage/!/containers` }
        case 800: { return `${host}/docs/#/storage/!/abques` }
        case 900: { return `${host}/docs/#/storage/!/cdns` }
        default: { return '' }
      }
    },
    description () {
      return this.getLogDescriptionByItem(this.item)
    },
    clearItem () {
      return this.getLogClearItem(this.item)
    }
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
    itemClickHandler (index, content) {
      content._description = `<div style="font-size: 1.1rem">${content.event_code}: ${this.getLogDescriptionByItem(content)}</div><div style="font-size: .9rem">${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}</div>`
      content._color = `text-${this.getLogItemColor(content.event_code)}`
      this.$emit('item-click', { index, content })
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
