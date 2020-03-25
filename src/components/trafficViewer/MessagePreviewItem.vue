<template>
  <q-timeline-entry
    :side="message.event === 'in' ? 'left' : 'right'"
    :color="`${eventsColors[message.event]}-6`"
    class="hex-viewer__timeline-element"
  >
    <div slot="title">
      <div style="line-height: 18px;">
        <span>{{eventsDesc[message.event]}}</span>
      </div>
      <div class="text-grey-5" style="font-size: .7rem;">{{date.formatDate(message.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}</div>
    </div>
    <div style="word-break: break-all; font-size: .8rem; height: 1rem;" class="ellipsis">{{dataPreview}}</div>
  </q-timeline-entry>
</template>

<script>
import { date } from 'quasar'
export default {
  props: ['message', 'view'],
  data () {
    return {
      date: date,
      eventsColors: {
        in: 'purple',
        out: 'yellow',
        open: 'green',
        close: 'red'
      },
      eventsDesc: {
        in: 'Data recieved',
        out: 'Data sent',
        open: 'Connect',
        close: 'Disconnect'
      },
      eventIcons: {
        in: 'mdi-arrow-right-thick',
        out: 'mdi-arrow-left-thick',
        open: 'mdi-lan-connect',
        close: 'mdi-lan-disconnect'
      }
    }
  },
  computed: {
    dataPreview () {
      let preview = this.message.hex || ''
      if (this.view === 'text' && preview) {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('')
      }
      return preview
    }
  }
}
</script>

<style lang="stylus">
  .hex-viewer__timeline-element
    .q-timeline__title
      margin-bottom 0
</style>
