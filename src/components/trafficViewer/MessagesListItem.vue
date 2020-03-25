<template>
  <q-item :class="[`${selected ? 'bg-grey-8' : ''}`]" clickable @click="(event) => { itemClickHandler(index, item, event) }">
    <q-tooltip>{{eventsDesc[item.event]}}</q-tooltip>
    <q-item-section v-if="actions" side class="q-pr-none">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon" :color="selected ? 'grey-5' : ''">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label header class="ellipsis overflow-hidden q-pa-none" :class="[`text-${eventsColors[item.event]}-${selected ? 3 : 4}`]">{{date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}</q-item-label>
      <q-item-label v-if="item.data_size" caption class="ellipsis overflow-hidden text-grey-5">{{`${item.data_size} B : `}}<small>{{dataPreview}}</small></q-item-label>
    </q-item-section>
    <q-item-section side class="">
      <small :class="[`text-grey-${selected ? 5 : 7}`]">{{eventsDesc[item.event]}}</small><q-icon class="q-ml-xs" :color="eventsColors[item.event]" :name="eventIcons[item.event]"/>
    </q-item-section>
  </q-item>
</template>

<script>
import { date } from 'quasar'

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
      let preview = this.item.hex
      if (this.view === 'text') {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('')
      }
      return preview
    }
  },
  methods: {
    clickHandler (index, type, content) {
      this.$emit('action', { index, type, content })
    },
    itemClickHandler (index, content, event) {
      this.$emit('item-click', { index, content, event })
    }
  }
}
</script>

<style lang="stylus">
</style>
