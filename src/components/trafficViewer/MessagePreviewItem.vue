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
        {{date.formatDate(message.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}
        <small class="rounded-borders q-mx-xs q-px-xs text-white" :class="{'bg-blue': transport === 'tcp', 'bg-purple-9': transport === 'udp'}">{{transport}}</small>
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
      transport: (this.message.type === 0 || this.message.type === 1) ? '' : (this.message.type >= 128) ? 'udp' : 'tcp',
      eventsColors: {
        0: 'green',
        1: 'red',
        2: 'purple',
        130: 'purple',
        3: 'yellow',
        131: 'yellow'
      },
      eventsDesc: {
        0: 'Connect',
        1: 'Disconnect',
        2: 'Data recieved',
        130: 'Data recieved',
        3: 'Data sent',
        131: 'Data sent'
      },
      eventIcons: {
        0: 'mdi-lan-connect',
        1: 'mdi-lan-disconnect',
        2: 'mdi-arrow-right-thick',
        130: 'mdi-arrow-right-thick',
        3: 'mdi-arrow-left-thick',
        131: 'mdi-arrow-left-thick'
      }
    }
  },
  computed: {
    dataPreview () {
      let preview = this.base64ToHex(this.message.data) || ''
      if (this.view === 'text' && preview) {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('')
      }
      return preview
    }
  },
  mixins: [convertMixin]
}
</script>

<style lang="stylus">
  .hex-viewer__timeline-element
    .q-timeline__title
      margin-bottom 0
</style>
