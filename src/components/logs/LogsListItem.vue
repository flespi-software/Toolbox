<template>
  <div :style="{height: `${itemHeight}px`, width: `${rowWidth}px`}" :class="[color]">
    <span class="list__item item_actions text-white" v-if="actionsVisible">
      <q-icon v-for="(action, i) in actions" :key="i" @click="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </span>
    <span v-for="(prop, k) in cols" :key="k" class="list__item" :class="{[`item_${k}`]: true}">
      <q-tooltip v-if="prop.name === 'event_code' && !!item['error_text']">{{item['error_text']}}</q-tooltip>
      <a target="_blank" :class="[color]" :href="eventLinkMore" v-if="prop.name === 'event_code'"><q-icon name="mdi-information-outline"/></a>
      {{getValueOfProp(prop)}}
    </span>
    <span v-if="etcVisible" class="list__item item_etc">{{etc}}</span>
  </div>
</template>

<script>
  import { date, QTooltip, QIcon } from 'quasar-framework'

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
          if (key === 'event_origin' || key === 'event_text' || key === 'item_data' || key === 'error_text' || key === 'close_code' || key === 'http_data' || key === 'current' || key === 'updated' || key === 'error_code') { return acc }
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
            return 'text-yellow'
          case 113:
          case 301:
          case 310:
          case 313:
          case 404:
            return 'text-grey-6'
          case 20:
          case 114:
          case 203:
          case 204:
          case 312:
          case 402:
          case 403:
            return 'text-red'
          case 102: {
            switch (this.item.close_code) {
              case 3: { return 'text-green' }
              case 2: { return 'text-grey-6' }
              case 4:
              case 5:
              case 6: { return 'text-red' }
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
          default: { return '' }
        }
      },
      description () {
        let types = {
            1: 'item was created, usually by customer via REST API',
            2: 'item was updated, usually by customer via REST API',
            3: 'item was deleted, usually by customer via REST API',
            20: 'item was blocked',
            21: 'item was deleted',
            100: 'channel has accepted connection',
            101: 'channel connection was identified',
            102: 'channel connection was closed',
            110: 'new channel\'s command was created',
            111: 'channel\'s command was updated',
            112: 'channel\'s command was deleted',
            113: 'channel\'s command executed or discarded',
            114: 'channel configuration is invalid',
            200: 'SMS was received via modem',
            201: 'SMS was sent via modem',
            202: 'modem has successfully connected to SMPP server',
            203: 'modem has lost connection to SMPP server',
            204: 'failed to connect to SMPP server',
            300: 'device connected',
            301: 'device disconnected',
            310: 'REST API (POST) request to read setting value from device',
            311: 'REST API (PUT) request to modify setting value on device',
            312: 'REST API (DELETE) request to delete current device setting value',
            313: 'Platform originated request to synchronize setting value from device',
            314: 'Device setting value was modified',
            401: 'stream connected successfully',
            402: 'stream has lost connection',
            403: 'stream failed to connect',
            404: 'stream has sent messages',
            410: 'new subscription was created for stream',
            411: 'stream subscription was updated',
            412: 'stream subscription was deleted'
          },
          closeCodes = {
            2: 'connection closed by tracking device',
            3: 'connection successfully processed and closed',
            4: 'received data violates channel\'s protocol',
            5: 'internal error',
            6: 'data parsing error',
            7: 'gateway server updated',
            8: 'channel protocol was modified on the server',
            9: 'channel\'s parameters changed',
            10: 'connection closed upon user\'s request',
            11: 'terminal mode ended'
          },
          errorCodes = {
            '-99': 'certificate error',
            '-2': 'failed to establish TCP connection',
            '-1': 'connection closed by flespi platform due to internal error',
            1: 'unacceptable protocol version',
            2: 'identifier rejected',
            3: 'server unavailable',
            4: 'bad username or password',
            5: 'connection not authorized',
            100: 'Continue',
            101: 'Switching Protocols',
            102: 'Processing',
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            207: 'Multi-Status',
            208: 'Already Reported',
            226: 'IM Used',
            300: 'Multiple Choices',
            301: 'Moved Permanently',
            302: 'Moved Temporarily',
            303: 'See Other',
            304: 'Not Modified',
            305: 'Use Proxy',
            307: 'Temporary Redirect',
            308: 'Permanent Redirect',
            400: 'Bad Request',
            401: 'Unauthorized',
            402: 'Payment Required',
            403: 'Forbidden',
            404: 'Not Found',
            405: 'Method Not Allowed',
            406: 'Not Acceptable',
            407: 'Proxy Authentication Required',
            408: 'Request Timeout',
            409: 'Conflict',
            410: 'Gone',
            411: 'Length Required',
            412: 'Precondition Failed',
            413: 'Payload Too Large',
            414: 'URI Too Long',
            415: 'Unsupported Media Type',
            416: 'Range Not Satisfiable',
            417: 'Expectation Failed',
            418: 'I’m a teapot',
            422: 'Unprocessable Entity',
            423: 'Locked',
            424: 'Failed Dependency',
            426: 'Upgrade Required',
            428: 'Precondition Required',
            429: 'Too Many Requests',
            431: 'Request Header Fields Too Large',
            449: 'Retry With',
            451: 'Unavailable For Legal Reasons',
            500: 'Internal Server Error',
            501: 'Not Implemented',
            502: 'Bad Gateway',
            503: 'Service Unavailable',
            504: 'Gateway Timeout',
            505: 'HTTP Version Not Supported',
            506: 'Variant Also Negotiates',
            507: 'Insufficient Storage',
            508: 'Loop Detected',
            509: 'Bandwidth Limit Exceeded',
            510: 'Not Extended',
            511: 'Network Authentication Required',
            520: 'Unknown Error',
            521: 'Web Server Is Down',
            522: 'Connection Timed Out',
            523: 'Origin Is Unreachable',
            524: 'A Timeout Occurred',
            525: 'SSL Handshake Failed',
            526: 'Invalid SSL Certificate'
          }
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
      getValueOfProp (prop) {
        let res = prop.custom ? JSON.stringify(this.item[prop.name]) : this.item[prop.name]
        if (prop.name === 'event_code') {
          res = this.description
        }
        if (prop.name === 'timestamp') {
          res = date.formatDate(this.item[prop.name] * 1000, 'HH:mm:ss')
        }
        return res
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
