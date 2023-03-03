<template>
  <q-item :class="[`${selected ? 'bg-grey-8' : ''}`, `traffic-viewer__item--connection-${item.conn}`]" clickable @click="(event) => { itemClickHandler(index, item, event) }" style="user-select: none">
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
        <small class="rounded-borders q-px-xs text-white bg-amber-8">
          {{item.conn.toString().slice(0,2)}}
          <q-tooltip>{{item.conn}}</q-tooltip>
        </small>
        <small class="rounded-borders q-mx-xs q-px-xs text-white" :class="{'bg-blue': transport === 'tcp', 'bg-pink-4': transport === 'udp', 'bg-green-9': transport === 'http', 'bg-purple-9': transport === 'mqtt'}">{{transport}}</small>
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
      259: 'custom'
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
        259: 'yellow'
      },
      eventsDesc: {
        0: 'Connect',
        32: 'Connect',

        1: 'Disconnect',
        33: 'Disconnect',

        2: 'Data received',
        130: 'Data received',
        66: 'Data received',
        34: 'Data received',
        258: 'Data received',

        3: 'Data sent',
        67: 'Data sent',
        131: 'Data sent',
        35: 'Data sent',
        259: 'Data sent'
      },
      eventIcons: {
        0: 'mdi-lan-connect',
        32: 'mdi-lan-connect',

        1: 'mdi-lan-disconnect',
        33: 'mdi-lan-disconnect',

        2: 'mdi-arrow-left-thick',
        130: 'mdi-arrow-left-thick',
        66: 'mdi-arrow-left-thick',
        34: 'mdi-arrow-left-thick',
        258: 'mdi-arrow-left-thick',

        3: 'mdi-arrow-right-thick',
        67: 'mdi-arrow-right-thick',
        35: 'mdi-arrow-right-thick',
        131: 'mdi-arrow-right-thick',
        259: 'mdi-arrow-right-thick'
      }
    }
  },
  computed: {
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
