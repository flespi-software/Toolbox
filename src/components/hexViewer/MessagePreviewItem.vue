<template>
  <q-timeline-entry
    :side="message['proxy.source'] === 0 ? 'left' : 'right'"
    :color="`${eventsColors[message['proxy.event']]}-6`"
    class="hex-viewer__timeline-element"
  >
    <div slot="title">
      <div style="line-height: 18px;">
        <span>{{eventsDesc[message['proxy.event']]}}</span>
        <span v-if="message['proxy.source']" class="q-ml-xs text-grey-5" style="font-size: .8rem;">[target {{message['proxy.source']}}]</span>
      </div>
      <div class="text-grey-5" style="font-size: .7rem;">{{date.formatDate(message.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}</div>
    </div>
    <div style="word-break: break-all; font-size: .8rem; height: 1rem;" class="ellipsis">{{dataPreview}}</div>
  </q-timeline-entry>
</template>

<script>
import { date } from 'quasar'
import convert from '../../mixins/convert'
export default {
  props: ['message', 'view'],
  mixins: [convert],
  data () {
    return {
      date: date,
      eventsColors: {
        0: 'purple',
        1: 'green',
        2: 'red'
      },
      eventsDesc: {
        0: 'Data recieved',
        1: 'Connect',
        2: 'Disconnect'
      }
    }
  },
  computed: {
    dataPreview () {
      let preview = this.message['proxy.payload.hex'] || ''
      if (this.view === 'text' && preview) {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => this.replaceByteWithMnemo(byte)).join('')
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
