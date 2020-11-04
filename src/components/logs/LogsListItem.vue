<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}">
    <div
      v-if="!item['__connectionStatus']"
      class="cursor-pointer"
      :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, boxSizing: 'border-box'}"
      :class="[color, item['x-flespi-status'] ? 'missed-items' : '']"
      @click="itemClickHandler(index, clearItem)"
    >
      <template v-for="(prop, k) in cols">
        <span class="list__item item_actions" :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}" v-if="prop.__dest === 'action'" :key="prop.name + k">
          <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, clearItem)"
                  :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
            <q-tooltip>{{action.label}}</q-tooltip>
          </q-icon>
        </span>
        <span v-else-if="prop.__dest === 'etc'" class="list__item item_etc" :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}" :key="prop.name + k">{{etc}}</span>
        <span
          v-else
          :key="prop.name + k"
          class="list__item"
          :class="{[`item_${k}`]: true, 'item--active': menuCellActive && menuCellActive.row === index && menuCellActive.col === k}"
        >
          <!--<q-tooltip>{{getValueOfProp(prop, item)}}</q-tooltip>-->
          <!-- <a :class="[color]" @click.prevent.stop="linkMoreClickHandler" v-if="prop.name === 'event_code'"><q-icon name="mdi-open-in-new"/></a> -->
          <template v-if="prop.name === 'event_code' && item.address">
            <q-icon v-if="item.address === 'connection'" name="mdi-ethernet" title="address: connection"/>
            <q-icon v-if="item.address === 'sms'" name="mdi-email-outline"  title="address: sms"/>
            <q-icon v-if="item.address === 'local'" name="mdi-content-save-outline"  title="address: local"/>
          </template>
          <q-icon name="mdi-download-network-outline" v-if="prop.name === 'event_code' && !!item['error_text'] && needTrafficRoute && item.ident" color="white" style="float: right; margin-top: 3px;" @click.stop.native="clickHandler(index, 'traffic', clearItem)"><q-tooltip>Show in traffic viewer</q-tooltip></q-icon>
          <q-icon name="mdi-alert-outline" v-if="prop.name === 'event_code' && !!item['error_text']"><q-tooltip>{{item['error_text']}}</q-tooltip></q-icon>
          <a @click.stop="" target="_blank" class="text-green" v-if="item.event_code === 901 && prop.name === 'name'" :href="`${$flespiCDN}/file/${item.uuid}`">
            {{getValueOfProp(prop, item)}}
          </a>
          <span v-else :title="JSON.stringify(getValueOfProp(prop, item))">
            {{getValueOfProp(prop, item)}}
          </span>
        </span>
      </template>
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

const getDescriptionByItem = (item) => {
  const types = events.types,
    closeCodes = events.closeCodes,
    errorCodes = events.errorCodes,
    sendCodes = events.sendCodes,
    codesByEvent = events.codesByEventcode
  let res = types[item.event_code] ? `${types[item.event_code]}` : item.event_code
  res += item.close_code
    ? ` (${closeCodes[item.close_code]})`
    : (closeCodes[item.close_code]
      ? `(${item.close_code})`
      : '')
  res += item.error_code
    ? ` (${item.error_code}: ${errorCodes[item.event_code][item.error_code]})`
    : (errorCodes[item.event_code] && errorCodes[item.event_code][item.error_code]
      ? `(${item.error_code})`
      : '')
  res += item.send_code
    ? ` (${item.send_code}: ${sendCodes[item.send_code]})`
    : (errorCodes[item.event_code] && errorCodes[item.event_code][item.send_code]
      ? `(${item.send_code})`
      : '')
  res += item.code && codesByEvent[item.event_code] && codesByEvent[item.event_code][item.code]
    ? ` (${item.code}: ${codesByEvent[item.event_code][item.code]})`
    : item.code && codesByEvent[item.event_code] && !codesByEvent[item.event_code][item.code]
      ? `(code: ${item.code})`
      : ''
  return res
}

export default {
  props: [
    'item',
    'index',
    'actions',
    'cols',
    'itemHeight',
    'rowWidth',
    'itemSettings',
    'menuCellActive'
  ],
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
        case 321:
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
        case 320:
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
        case 103:
        case 114:
        case 203:
        case 204:
        case 304:
        case 315:
        case 316:
        case 322:
        case 402:
        case 403:
        case 501:
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
            case 15:
            case 16: { return 'text-grey-6' }
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
      return getDescriptionByItem(this.item)
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
    hasInCols (prop) {
      return !!this.cols.filter(col => prop === col.name).length
    },
    clickHandler (index, type, content) {
      this.$emit('action', { index, type, content })
    },
    linkMoreClickHandler () {
      openURL(this.eventLinkMore)
    },
    getValueOfProp (prop, item) {
      let res = prop.custom ? JSON.stringify(item[prop.name]) : item[prop.name]
      if (prop.name === 'event_code') {
        res = getDescriptionByItem(item)
      } else if (prop.name === 'timestamp') {
        res = date.formatDate(item[prop.name] * 1000, 'DD/MM/YYYY HH:mm:ss')
      } else if (prop.name === 'host') {
        res = item.host || item.source || ''
      }
      return res
    },
    itemClickHandler (index, content) {
      content._description = `[${date.formatDate(this.item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}] ${this.item.event_code}: ${this.description}`
      content._color = this.color
      this.$emit('item-click', { index, content })
    }
  }
}
</script>

<style lang="stylus">
  .list__item
    display inline-block
    min-height 19px
    white-space nowrap
    padding-left 5px
    text-overflow ellipsis
    overflow hidden
    border-right 2px solid $grey-8
  .item--active
    background-color $grey-1
  .message-viewer .q-w-list>.missed-items
    background-color rgba(255,255,255,.05)
    &:nth-child(odd)
      background-color rgba(255,255,255,.1)
</style>
