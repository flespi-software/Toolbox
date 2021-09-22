<template>
  <q-item :class="[`${selected ? 'bg-grey-8' : ''}`]" clickable @click="(event) => { itemClickHandler(index, item, event) }" style="user-select: none">
    <q-tooltip>{{eventsDesc[item['proxy.event']]}}</q-tooltip>
    <q-item-section v-if="actions" side class="q-pr-none">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon" :color="selected ? 'grey-5' : ''">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label header class="ellipsis overflow-hidden q-pa-none" :class="[`text-${eventsColors[item['proxy.event']]}-${selected ? 3 : 4}`]">{{date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss.SSS')}}</q-item-label>
      <q-item-label v-if="item['proxy.payload.size']" caption class="ellipsis overflow-hidden text-grey-5">{{`${item['proxy.payload.size']} B : `}}<small>{{dataPreview}}</small></q-item-label>
    </q-item-section>
    <q-item-section side class="">
      <small :class="[`text-grey-${selected ? 5 : 7}`]">{{item['proxy.source'] === 0 ? 'incoming' : `target ${item['proxy.source']}`}}</small><q-icon class="q-ml-xs" :color="item['proxy.source'] === 0 ? 'green' : 'yellow'" :name="item['proxy.source'] === 0 ? 'mdi-arrow-right-thick' : item['proxy.event'] === 1 ? 'mdi-arrow-right-thick' : 'mdi-arrow-left-thick'"/>
    </q-item-section>
  </q-item>
</template>

<script>
import { date } from 'quasar'
import convert from '../../mixins/convert'

export default {
  props: [
    'item',
    'index',
    'actions',
    'itemHeight',
    'selected',
    'view'
  ],
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
        0: 'Data received',
        1: 'Connect',
        2: 'Disconnect'
      }
    }
  },
  computed: {
    dataPreview () {
      let preview = this.item['proxy.payload.hex']
      if (this.view === 'text') {
        const bytesHexArray = preview.match(/.{1,2}/g)
        preview = bytesHexArray.map((byte) => {
          return this.replaceByteWithMnemo(byte)
        }).join('')
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
