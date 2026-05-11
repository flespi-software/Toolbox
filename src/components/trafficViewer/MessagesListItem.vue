<template>
  <q-item :class="[`${selected ? 'bg-grey-8' : ''}`, `traffic-viewer__item--connection-${item.conn}`]" clickable @click="(event) => { itemClickHandler(index, item, event) }" :style="{ userSelect: 'none', borderLeft: `3px solid ${borderColor}` }">
    <q-tooltip>{{eventsDesc[item.type]}}</q-tooltip>
    <q-item-section v-if="actions" side class="q-pr-none">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon" :color="selected ? 'grey-5' : ''">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label header class="ellipsis overflow-hidden q-pa-none" :class="[`text-${eventsColors[item.type]}-${selected ? 3 : 4}`]">{{date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss.SSS (Z)')}}</q-item-label>
      <q-item-label v-if="size" caption class="ellipsis overflow-hidden text-grey-5">{{`${size} B : `}}<small>{{dataPreview}}</small></q-item-label>
    </q-item-section>
    <q-item-section side class="">
      <small :class="[`text-grey-${selected ? 5 : 7}`]">{{eventsDesc[item.type]}}</small>
      <div>
        <small class="rounded-borders q-px-xs text-white bg-amber-8 cursor-pointer" @click.stop="$emit('conn-filter', item.conn)">
          #{{item.conn.toString().slice(-6)}}
          <q-tooltip>conn: {{item.conn}} — click to filter</q-tooltip>
        </small>
        <small class="rounded-borders q-mx-xs q-px-xs text-white" :class="{'bg-blue': transport === 'tcp', 'bg-pink-4': transport === 'udp', 'bg-green-9': transport === 'http', 'bg-purple-9': transport === 'mqtt', 'bg-cyan-9': transport === 'ftp'}">{{transport}}</small>
        <q-icon class="q-ml-xs" size="1.2rem" :color="eventsColors[item.type]" :name="eventIcons[item.type]"/>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import { date } from 'quasar'
import convertMixin from '../../mixins/convert'
export default {
  props: [
    'item',
    'index',
    'actions',
    'itemHeight',
    'selected',
    'view'
  ],
  data () {
     const transports = {
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
     }
    return {
      date: date,
      transport: transports[this.item.type],
      hex: this.base64ToHex(this.item.data),
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
      }
    }
  },
  computed: {
    borderColor () {
      const categories = {
        0: 'connect', 32: 'connect', 512: 'connect',
        1: 'disconnect', 33: 'disconnect', 513: 'disconnect',
        2: 'received', 130: 'received', 66: 'received', 34: 'received', 258: 'received', 514: 'received',
        3: 'sent', 67: 'sent', 131: 'sent', 35: 'sent', 259: 'sent', 515: 'sent'
      }
      const colors = { connect: '#66BB6A', disconnect: '#EF5350', received: '#AB47BC', sent: '#FFEE58' }
      return colors[categories[this.item.type]] || 'transparent'
    },
    dataPreview () {
      if (!this.item.data) { return '' }
      let preview = this.hex
      if (this.view === 'text') {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => this.replaceByteWithMnemo(byte)).join('')
      }
      return preview
    },
    size () {
      if (!this.item.data) { return null }
      return Math.floor(this.hex.length / 2)
    }
  },
  methods: {
    clickHandler (index, type, content) {
      const data = { ...content }
      data.data = this.dataPreview
      this.$emit('action', { index, type, content: data })
    },
    itemClickHandler (index, content, event) {
      this.$emit('item-click', { index, content, event })
    }
  },
  mixins: [convertMixin]
}
</script>
