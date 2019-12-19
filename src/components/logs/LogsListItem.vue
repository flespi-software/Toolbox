<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}">
    <div
      v-if="!item['__connectionStatus'] && !item['x-flespi-filter-prev'] && !item['x-flespi-filter-next']"
      class="cursor-pointer"
      :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, borderBottom: item.delimiter ? 'solid 1px #f40' : '', boxSizing: 'border-box'}"
      :class="[color, item.__status ? 'missed-items' : '']"
      @click="itemClickHandler(index, clearItem)">
    <span class="list__item item_actions text-white" v-if="actionsVisible">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </span>
    <span
      v-for="(prop, k) in cols"
      :key="prop.name + k"
      class="list__item"
      :class="{[`item_${k}`]: true}"
      :style="{backgroundColor: item['x-flespi-filter-fields'] && item['x-flespi-filter-fields'].includes(prop.name) ? '#666' : ''}"
    >
      <!--<q-tooltip>{{getValueOfProp(prop)}}</q-tooltip>-->
      <!-- <a :class="[color]" @click.prevent.stop="linkMoreClickHandler" v-if="prop.name === 'event_code'"><q-icon name="mdi-open-in-new"/></a> -->
      <template v-if="prop.name === 'event_code' && item.address">
        <q-icon v-if="item.address === 'connection'" name="mdi-ethernet" title="address: connection"/>
        <q-icon v-if="item.address === 'sms'" name="mdi-email-outline"  title="address: sms"/>
        <q-icon v-if="item.address === 'local'" name="mdi-content-save-outline"  title="address: local"/>
      </template>
      <q-icon name="mdi-alert-outline" v-if="prop.name === 'event_code' && !!item['error_text']"><q-tooltip>{{item['error_text']}}</q-tooltip></q-icon>
      <a @click.stop="" target="_blank" class="text-green" v-if="item.event_code === 901 && prop.name === 'name'" :href="`${SERVER ? ' https://cdn.flespi.io/' : 'https://localhost:9019/'}file/${item.uuid}`">
        {{getValueOfProp(prop)}}
      </a>
      <span v-else :title="JSON.stringify(getValueOfProp(prop))">
        {{getValueOfProp(prop)}}
      </span>
    </span>
      <span v-if="etcVisible" class="list__item item_etc">{{etc}}</span>
    </div>
    <div
      v-else-if="item['x-flespi-filter-prev'] || item['x-flespi-filter-next']"
      :style="{
      height: `${itemHeight}px`,
      width: `${rowWidth}px`,
      color: '#000',
      fontWeight: 'bold',
      backgroundColor: item['x-flespi-filter-prev'] ? '#819002' : '#ccb300',
      overflow: 'hidden'
    }"
    >
      <span class="text-uppercase text-white" style="padding: 0 5px;" >{{item['x-flespi-filter-next'] ? `Next results will be filtered by: "${item['x-flespi-filter-next']}"` : `Filter removed: "${item['x-flespi-filter-prev']}"`}}</span>
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
    }" :class="[color]"
      :title="date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')"
    >
      <span style="padding: 0 5px; margin-left: 150px;" :style="{ backgroundColor: item.__connectionStatus === 'offline' ? '#ff0' : '#0f0'}"  class="text-uppercase" v-for="n in Array(10)" :key="n">{{item['__connectionStatus']}}</span>
    </div>
  </div>
</template>

<script>
import { date, openURL } from 'quasar'
import events from './events.json'

export default {
  props: [
    'item',
    'index',
    'actions',
    'cols',
    'etcVisible',
    'actionsVisible',
    'itemHeight',
    'rowWidth'
  ],
  data () {
    return {
      date: date,
      SERVER: SERVER
    }
  },
  computed: {
    etc () {
      let etcKeys = Object.keys(this.item).filter(key => !this.hasInCols(key))
      return etcKeys.reduce((acc, key) => {
        if (
          key === 'delimiter' ||
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
          key === '__status' ||
          key === 'uuid' ||
          key === 'x-flespi-filter-fields' ||
          key === 'x-flespi-filter-next' ||
          key === 'x-flespi-filter-prev'
        ) { return acc }
        acc += `${key}: ${JSON.stringify(this.item[key])}; `
        return acc
      }, '') || '*Empty*'
    },
    color () {
      switch (this.item.event_code) {
        case 1:
        case 100:
        case 101:
        case 110:
        case 200:
        case 202:
        case 300:
        case 312:
        case 313:
        case 401:
        case 410:
        case 420:
        case 430:
        case 500:
        case 510:
        case 601:
        case 605:
        case 901:
          return 'text-green'
        case 2:
        case 3:
        case 21:
        case 111:
        case 112:
        case 302:
        case 303:
        case 311:
        case 314:
        case 411:
        case 412:
        case 502:
        case 504:
        case 511:
        case 600:
        case 603:
        case 604:
        case 900:
          return 'text-yellow'
        case 113:
        case 301:
        case 310:
        case 404:
        case 422:
        case 432:
        case 503:
        case 512:
        case 602:
        case 700:
        case 800:
          return 'text-grey-6'
        case 20:
        case 114:
        case 203:
        case 204:
        case 315:
        case 316:
        case 402:
        case 403:
        case 501:
        case 902:
          return 'text-red'
        case 201: {
          if (this.item.send_code < 0) {
            return 'text-red'
          } else {
            return 'text-green'
          }
        }
        case 102: {
          switch (this.item.close_code) {
            case 3: { return 'text-green' }
            case 2:
            case 12:
            case 15: { return 'text-grey-6' }
            case 4:
            case 5:
            case 6:
            case 11:
            case 13:
            case 14: { return 'text-red' }
            case 7:
            case 8:
            case 9:
            case 10: { return 'text-yellow' }
            default: { return '' }
          }
        }
        default:
          return ''
      }
    },
    eventLinkMore () {
      switch (this.item.event_code) {
        case 1:
        case 2:
        case 3: { return `${SERVER || 'https:localhost:9005'}/docs/#/platform` }
        case 20:
        case 21: { return `${SERVER || 'https:localhost:9005'}/docs/#/platform/!/counters` }
        case 100:
        case 101:
        case 102: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/connections` }
        case 110:
        case 111:
        case 112:
        case 113: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/commands` }
        case 114: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/channels` }
        case 200:
        case 201:
        case 202:
        case 203:
        case 204: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/modems` }
        case 300:
        case 301:
        case 302:
        case 303:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 315:
        case 316: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/devices` }
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
        case 432: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/streams` }
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 510:
        case 511:
        case 512: { return `${SERVER || 'https:localhost:9005'}/docs/#/mqtt/!/sessions` }
        case 600: { return `${SERVER || 'https:localhost:9005'}/docs/#/platform/!/tokens` }
        case 601:
        case 602:
        case 603:
        case 604:
        case 605: { return `${SERVER || 'https:localhost:9005'}/docs/#/gw/!/calcs` }
        case 700: { return `${SERVER || 'https:localhost:9005'}/docs/#/storage/!/containers` }
        case 800: { return `${SERVER || 'https:localhost:9005'}/docs/#/storage/!/abques` }
        case 900:
        case 901:
        case 902: { return `${SERVER || 'https:localhost:9005'}/docs/#/storage/!/cdns` }
        default: { return '' }
      }
    },
    description () {
      let types = events.types,
        closeCodes = events.closeCodes,
        errorCodes = events.errorCodes,
        sendCodes = events.sendCodes,
        codesByEvent = events.codesByEventcode
      let res = types[this.item.event_code] ? `${types[this.item.event_code]}` : this.item.event_code
      res += this.item.close_code
        ? ` (${closeCodes[this.item.close_code]})`
        : (closeCodes[this.item.close_code]
          ? `(${this.item.close_code})`
          : '')
      res += this.item.error_code
        ? ` (${this.item.error_code}: ${errorCodes[this.item.event_code][this.item.error_code]})`
        : (errorCodes[this.item.event_code] && errorCodes[this.item.event_code][this.item.error_code]
          ? `(${this.item.error_code})`
          : '')
      res += this.item.send_code
        ? ` (${this.item.send_code}: ${sendCodes[this.item.send_code]})`
        : (errorCodes[this.item.event_code] && errorCodes[this.item.event_code][this.item.send_code]
          ? `(${this.item.send_code})`
          : '')
      res += this.item.code && codesByEvent[this.item.event_code] && codesByEvent[this.item.event_code][this.item.code]
        ? ` (${this.item.code}: ${codesByEvent[this.item.event_code][this.item.code]})`
        : this.item.code && codesByEvent[this.item.event_code] && !codesByEvent[this.item.event_code][this.item.code]
          ? `(code: ${this.item.code})`
          : ''
      return res
    },
    clearItem () {
      return Object.keys(this.item).reduce((result, key) => {
        if (
          key === 'delimiter' ||
          key === '__status' ||
          key === 'x-flespi-filter-fields' ||
          key === 'x-flespi-filter-next' ||
          key === 'x-flespi-filter-prev'
        ) {
          return result
        }
        result[key] = this.item[key]
        return result
      }, {})
    }
  },
  methods: {
    hasInCols (prop) {
      return !!this.cols.filter(col => prop === col.name).length
    },
    clickHandler (index, type, content) {
      this.$emit(`action`, { index, type, content })
    },
    linkMoreClickHandler () {
      openURL(this.eventLinkMore)
    },
    getValueOfProp (prop) {
      let res = prop.custom ? JSON.stringify(this.item[prop.name]) : this.item[prop.name]
      if (prop.name === 'event_code') {
        res = this.description
      }
      if (prop.name === 'timestamp') {
        res = date.formatDate(this.item[prop.name] * 1000, 'DD/MM/YYYY HH:mm:ss')
      }
      if (prop.name === 'host') {
        res = this.item['host'] || this.item['source'] || ''
      }
      return res
    },
    itemClickHandler (index, content) {
      content._description = `[${date.formatDate(this.item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}] ${this.item.event_code}: ${this.description}`
      content._color = this.color
      this.$emit(`item-click`, { index, content })
    }
  }
}
</script>

<style lang="stylus">
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
