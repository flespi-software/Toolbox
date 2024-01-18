<template>
  <q-timeline-entry
    :side="message.type === 2 || message.type === 130  ? 'left' : 'right'"
    :color="`${eventsColors[message.type]}-6`"
    class="hex-viewer__timeline-element"
  >
    <div slot="title">
      <div style="line-height: 18px;">
        <span>{{eventsDesc[message.type]}}</span>
      </div>
      <div class="text-grey-5" style="font-size: .7rem;">
        {{date.formatDate(message.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss.SSS (Z)')}}
        <small class="rounded-borders q-mx-xs q-px-xs text-white" :class="{'bg-blue': transport === 'tcp', 'bg-pink-4': transport === 'udp', 'bg-green-9': transport === 'http', 'bg-purple-9': transport === 'mqtt'}">{{transport}}</small>
      </div>
    </div>
    <div style="word-break: break-all; font-size: .8rem; height: 1rem;" class="ellipsis">{{dataPreview}}</div>
  </q-timeline-entry>
</template>

<script>
import { date } from 'quasar'
import convertMixin from '../../mixins/convert'
export default {
  props: ['message', 'view'],
  data () {
    return {
      date: date,
      transports: {
        2: 'tcp',
        3: 'tcp',

        66: 'http',
        67: 'http',

        130: 'udp',
        131: 'udp',

        32: 'mqtt',
        33: 'mqtt',
        34: 'mqtt',
        35: 'mqtt',

        258: 'custom',
        259: 'custom',

        512: 'ftp',
        513: 'ftp',
        514: 'ftp',
        515: 'ftp',
        516: 'ftp'
      },
      eventsColors: {
        0: 'green',
        32: 'green',

        1: 'red',
        33: 'red',

        2: 'purple',
        130: 'purple',
        66: 'purple',
        34: 'purple',
        258: 'purple',

        3: 'yellow',
        67: 'yellow',
        131: 'yellow',
        35: 'yellow',
        259: 'yellow',

        512: 'green',
        513: 'red',
        514: 'purple',
        515: 'yellow',
      },
      eventsDesc: {
        0: 'Connect',
        32: 'Connect',
        512: 'Connect',

        1: 'Disconnect',
        33: 'Disconnect',
        513: 'Disconnect',

        2: 'Data received',
        130: 'Data received',
        66: 'Data received',
        34: 'Data received',
        258: 'Data received',
        514: 'Data received',

        3: 'Data sent',
        67: 'Data sent',
        131: 'Data sent',
        35: 'Data sent',
        259: 'Data sent',
        515: 'Data sent'
      },
      eventIcons: {
        0: 'mdi-lan-connect',
        32: 'mdi-lan-connect',
        512: 'mdi-lan-connect',

        1: 'mdi-lan-disconnect',
        33: 'mdi-lan-disconnect',
        513: 'mdi-lan-disconnect',

        2: 'mdi-arrow-left-thick',
        130: 'mdi-arrow-left-thick',
        66: 'mdi-arrow-left-thick',
        34: 'mdi-arrow-left-thick',
        258: 'mdi-arrow-left-thick',
        514: 'mdi-arrow-left-thick',

        3: 'mdi-arrow-right-thick',
        67: 'mdi-arrow-right-thick',
        35: 'mdi-arrow-right-thick',
        131: 'mdi-arrow-right-thick',
        259: 'mdi-arrow-right-thick',
        515: 'mdi-arrow-right-thick'
      }
    }
  },
  computed: {
    dataPreview () {
      let preview = this.base64ToHex(this.message.data) || ''
      if (this.view === 'text' && preview) {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => this.replaceByteWithMnemo(byte)).join('')
      }
      return preview
    },
    transport () { return this.transports[this.message.type] }
  },
  mixins: [convertMixin]
}
</script>

<style lang="stylus">
  .hex-viewer__timeline-element
    .q-timeline__title
      margin-bottom 0
</style>
