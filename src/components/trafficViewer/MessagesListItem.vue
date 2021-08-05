<template>
  <q-item :class="[`${selected ? 'bg-grey-8' : ''}`]" clickable @click="(event) => { itemClickHandler(index, item, event) }" style="user-select: none">
    <q-tooltip>{{eventsDesc[item.type]}}</q-tooltip>
    <q-item-section v-if="actions" side class="q-pr-none">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon" :color="selected ? 'grey-5' : ''">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label header class="ellipsis overflow-hidden q-pa-none" :class="[`text-${eventsColors[item.type]}-${selected ? 3 : 4}`]">{{date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}</q-item-label>
      <q-item-label v-if="size" caption class="ellipsis overflow-hidden text-grey-5">{{`${size} B : `}}<small>{{dataPreview}}</small></q-item-label>
    </q-item-section>
    <q-item-section side class="">
      <small :class="[`text-grey-${selected ? 5 : 7}`]">{{eventsDesc[item.type]}}</small>
      <div><small class="rounded-borders q-mx-xs q-px-xs text-white" :class="{'bg-blue': transport === 'tcp', 'bg-purple-9': transport === 'udp', 'bg-green-9': transport === 'http'}">{{transport}}</small><q-icon class="q-ml-xs" size="1.2rem" :color="eventsColors[item.type]" :name="eventIcons[item.type]"/></div>
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
    return {
      date: date,
      transport: (this.item.type === 0 || this.item.type === 1) ? '' : (this.item.type === 66 || this.item.type === 67) ? 'http' : (this.item.type >= 128) ? 'udp' : 'tcp',
      hex: this.base64ToHex(this.item.data),
      eventsColors: {
        0: 'green',
        1: 'red',
        2: 'purple',
        66: 'purple',
        67: 'yellow',
        130: 'purple',
        3: 'yellow',
        131: 'yellow'
      },
      eventsDesc: {
        0: 'Connect',
        1: 'Disconnect',
        2: 'Data received',
        130: 'Data received',
        66: 'Data received',
        67: 'Data sent',
        3: 'Data sent',
        131: 'Data sent'
      },
      eventIcons: {
        0: 'mdi-lan-connect',
        1: 'mdi-lan-disconnect',
        2: 'mdi-arrow-right-thick',
        66: 'mdi-arrow-right-thick',
        67: 'mdi-arrow-left-thick',
        130: 'mdi-arrow-right-thick',
        3: 'mdi-arrow-left-thick',
        131: 'mdi-arrow-left-thick'
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
