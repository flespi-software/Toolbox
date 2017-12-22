<template>
  <div
    class="cursor-pointer"
    :style="{height: `${itemHeight}px`, width: `${rowWidth}px`, borderBottom: item.delimiter ? 'solid 1px #f40' : ''}" :class="[color]"
    @click="itemClickHandler(index, item)">
    <span class="list__item item_actions text-white" v-if="actionsVisible">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </span>
    <span v-for="(prop, k) in cols" :key="prop.name + k" class="list__item" :class="{[`item_${k}`]: true}" :title="JSON.stringify(getValueOfProp(prop))">
      <!--<q-tooltip>{{getValueOfProp(prop)}}</q-tooltip>-->
      <a :class="[color]" @click.prevent.stop="linkMoreClickHandler" v-if="prop.name === 'event_code'"><q-icon name="mdi-open-in-new"/></a>
      <q-icon name="mdi-alert-outline" v-if="prop.name === 'event_code' && !!item['error_text']"><q-tooltip>{{item['error_text']}}</q-tooltip></q-icon>
      {{getValueOfProp(prop)}}
    </span>
    <span v-if="etcVisible" class="list__item item_etc">{{etc}}</span>
  </div>
</template>

<script>
  import { date, QTooltip, QIcon, openURL } from 'quasar-framework'
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
    computed: {
      etc () {
        let etcKeys = Object.keys(this.item).filter(key => !this.hasInCols(key))
        return etcKeys.reduce((acc, key) => {
          if (key === 'delimiter' || key === 'event_origin' || key === 'event_text' || key === 'item_data' || key === 'source' || key === 'error_text' || key === 'close_code' || key === 'http_data' || key === 'current' || key === 'updated' || key === 'error_code' || key === 'smpp_code') { return acc }
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
          case 201:
          case 202:
          case 300:
          case 401:
          case 410:
          case 500:
          case 510:
            return 'text-green'
          case 2:
          case 3:
          case 21:
          case 111:
          case 112:
          case 311:
          case 314:
          case 411:
          case 412:
          case 502:
          case 511:
            return 'text-yellow'
          case 113:
          case 301:
          case 310:
          case 313:
          case 404:
          case 503:
          case 512:
            return 'text-grey-6'
          case 20:
          case 114:
          case 203:
          case 204:
          case 312:
          case 402:
          case 403:
          case 501:
            return 'text-red'
          case 102: {
            switch (this.item.close_code) {
              case 3: { return 'text-green' }
              case 2: { return 'text-grey-6' }
              case 4:
              case 5:
              case 6:
              case 12: { return 'text-red' }
              case 7:
              case 8:
              case 9:
              case 10:
              case 11: { return 'text-yellow' }
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
          case 3: { return `${SERVER}/docs/#/platform` }
          case 20:
          case 21: { return `${SERVER}/docs/#/platform/!/counters` }
          case 100:
          case 101:
          case 102: { return `${SERVER}/docs/#/gw/!/connections` }
          case 110:
          case 111:
          case 112:
          case 113: { return `${SERVER}/docs/#/gw/!/commands` }
          case 114: { return `${SERVER}/docs/#/gw/!/channels` }
          case 200:
          case 201:
          case 202:
          case 203:
          case 204: { return `${SERVER}/docs/#/gw/!/modems` }
          case 300:
          case 301:
          case 310:
          case 311:
          case 312:
          case 313:
          case 314: { return `${SERVER}/docs/#/registry/!/devices` }
          case 401:
          case 402:
          case 403:
          case 404:
          case 410:
          case 411:
          case 412: { return `${SERVER}/docs/#/registry/!/streams` }
          case 500:
          case 501:
          case 502:
          case 503:
          case 510:
          case 511:
          case 512: { return `${SERVER}/docs/#/mqtt/!/sessions` }
          default: { return '' }
        }
      },
      description () {
        let types = events.types,
          closeCodes = events.closeCodes,
          errorCodes = events.errorCodes,
          smppCodes = events.smppCodes
        let res = types[this.item.event_code] ? `${this.item.event_code}: ${types[this.item.event_code]}` : this.item.event_code
        res += this.item.close_code
          ? ` (${closeCodes[this.item.close_code]})`
          : (closeCodes[this.item.close_code]
            ? `(${this.item.close_code})`
            : '')
        res += this.item.error_code
          ? ` (${this.item.error_code}: ${errorCodes[this.item.error_code]})`
          : (errorCodes[this.item.error_code]
            ? `(${this.item.error_code})`
            : '')
        res += this.item.smpp_code
          ? ` (${this.item.smpp_code}: ${smppCodes[this.item.smpp_code]})`
          : (errorCodes[this.item.smpp_code]
            ? `(${this.item.smpp_code})`
            : '')
        return res
      }
    },
    methods: {
      hasInCols (prop) {
        return !!this.cols.filter(col => prop === col.name).length
      },
      clickHandler (index, type, content) {
        this.$emit(`action`, {index, type, content})
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
        this.$emit(`item-click`, {index, content})
      }
    },
    components: {QTooltip, QIcon}
  }
</script>

<style lang="stylus">
  .list__item
    display inline-block
    white-space nowrap
    margin 0 10px 0 5px
    text-overflow ellipsis
    overflow hidden
</style>
