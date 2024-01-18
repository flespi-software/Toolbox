<template>
  <div v-if="packets && packets.length">
    <div class="traffic-viewer__packets q-pa-sm scroll" :style="`height: ${converter ? 'calc(100% - 17px)' : 'height:100%'};`">
      <div v-for="(batch, index) in batches" :key="index" style="min-width: 820px;">
        <div class="packets__separator" :style="{backgroundColor: bgDataColors[batch.type]}" v-if="batches[index - 1]"></div>
        <div class="packet__header text-center" :style="{backgroundColor: bgDataColors[batch.type]}">
          <span class="rounded-borders text-white full-height">
            <q-icon size="1rem" :color="eventsColors[batch.type]" :name="eventIcons[batch.type]" style="vertical-align: text-bottom;"/>
            <span class="text-uppercase text-white">{{eventsDesc[batch.type]}}</span>
            (
            <span class="text-white" :class="{'q-mr-sm': batch.size}" style="font-size: .8rem">{{date.formatDate(batch.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss.SSS (Z)')}}</span>
            <span v-if="batch.size" class="q-mr-sm text-white" style="font-size: .8rem">size: {{batch.size}}B</span>
            <small
              v-if="batch.transport"
              class="rounded-borders q-px-xs text-white"
              :class="{'bg-blue': batch.transport === 'tcp', 'bg-pink-4': batch.transport === 'udp', 'bg-green-9': batch.transport === 'http', 'bg-purple-9': batch.transport === 'mqtt'}"
              style="vertical-align: middle;"
            >
              {{batch.transport}}
            </small>
            )
          </span>
        </div>
        <hex-viewer
          :style="{backgroundColor: bgDataColors[batch.type]}"
          v-if="batch.data"
          :hex="batch.data"
          :view="view"
          @selectedBytes="convertSelectedBytes"
        />
        <div class="packets__separator" :style="{backgroundColor: bgDataColors[batch.type]}" v-if="batches[index + 1]"></div>
        <div class="packets__missing" v-if="getNeedMissing(index)">
          <div class="missing__up"></div>
          <div class="missing__down"></div>
        </div>
      </div>
    </div>
    <HexConverter v-if="converter" :hex="selectedbytes" />
  </div>
  <div v-else style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" >Select packets</div>
</template>

<script>
import HexViewer from '../HexViewer'
import HexConverter from '../widgets/HexConverter'
import convertMixin from '../../mixins/convert'
import { date } from 'quasar'
export default {
  props: ['packets', 'view'],
  data () {
    return {
      date,
      selectedbytes: '',
      converter: false,
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
        515: 'yellow'
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
      },
      bgDataColors: {
        0: 'rgba(76, 175, 80, 0.4)',
        32: 'rgba(76, 175, 80, 0.4)',
        512: 'rgba(76, 175, 80, 0.4)',

        1: 'rgba(244, 67, 54, 0.4)',
        33: 'rgba(244, 67, 54, 0.4)',
        513: 'rgba(244, 67, 54, 0.4)',

        2: 'rgba(156, 39, 176, 0.4)',
        130: 'rgba(156, 39, 176, 0.4)',
        34: 'rgba(156, 39, 176, 0.4)',
        66: 'rgba(156, 39, 176, 0.4)',
        258: 'rgba(156, 39, 176, 0.4)',
        514: 'rgba(156, 39, 176, 0.4)',

        3: 'rgba(255, 235, 59, 0.4)',
        67: 'rgba(255, 235, 59, 0.4)',
        35: 'rgba(255, 235, 59, 0.4)',
        131: 'rgba(255, 235, 59, 0.4)',
        259: 'rgba(255, 235, 59, 0.4)',
        515: 'rgba(255, 235, 59, 0.4)'
      }
    }
  },
  computed: {
    batches () {
      if (!this.packets || !this.packets.length) { return [] }
      return this.packets.reduce((batches, packet, index) => {
        const batch = { ...packet }
        batch.data = this.base64ToHex(packet.data)
        batch.index = [batch.index]
        batch.transport = this.transports[batch.type]
        if (batch.data) {
          batch.size = Math.floor(batch.data.length / 2)
        }
        const prevBatch = batches[batches.length - 1]
        if (prevBatch && prevBatch.type === batch.type && batch.type === 2 && prevBatch.conn === batch.conn && prevBatch.index[prevBatch.index.length - 1] + 1 === batch.index[0]) {
          prevBatch.data += batch.data
          prevBatch.size += batch.size
          prevBatch.index = [...prevBatch.index, ...batch.index]
        } else {
          batches.push(batch)
        }
        return batches
      }, [])
    }
  },
  methods: {
    getNeedMissing (batchIndex) {
      const current = this.batches[batchIndex]
      const nextBatch = this.batches[batchIndex + 1]
      return nextBatch && current.index[current.index.length - 1] + 1 < nextBatch.index[0]
    },
    convertSelectedBytes (bytes) {
      if (bytes) {
        this.selectedbytes = bytes
        this.converter = true
      } else {
        this.converter = false
      }
    }
  },
  mixins: [convertMixin],
  components: { HexViewer, HexConverter }
}
</script>
<style lang="stylus">
  .packets__separator
    position relative
    left 50%
    width 3px
    height 15px
  .packets__missing
    .missing__up
      &:after
        background linear-gradient(-45deg, $yellow-9 5px, transparent 0), linear-gradient(45deg, $yellow-9 5px, transparent 0)
        background-position left-bottom
        background-repeat repeat-x
        background-size 10px 10px
        content: " "
        display block
        bottom 0px
        left 0px
        width 100%
        height 10px
    .missing__down
      margin-top -7px
      &:after
        background linear-gradient(-45deg, $grey-9 5px, transparent 0), linear-gradient(45deg, $grey-9 5px, transparent 0)
        background-position left-bottom
        background-repeat repeat-x
        background-size 10px 10px
        content " "
        display block
        bottom 0px
        left 0px
        width 100%
        height 10px
</style>
