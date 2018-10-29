<template>
  <q-item :class="[`text-${eventsColors[item['proxy.event']]}-4`, `${selected ? 'bg-grey-10' : ''}`]" @click.native="(event) => { itemClickHandler(index, item, event) }">
    <q-tooltip>{{eventsDesc[item['proxy.event']]}}</q-tooltip>
    <q-item-side v-if="actions">
      <q-icon v-for="(action, i) in actions" :key="i" @click.stop.native="clickHandler(index, action.type, item)" :class="action.classes" class="cursor-pointer on-left" :name="action.icon">
        <q-tooltip>{{action.label}}</q-tooltip>
      </q-icon>
    </q-item-side>
    <q-item-main>
      <q-item-tile label>{{date.formatDate(item.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}</q-item-tile>
      <q-item-tile v-if="item['proxy.payload.size']" sublabel>{{`${item['proxy.payload.size']} B : `}}<small>{{item['proxy.payload.hex'].slice(0, 15)}}...</small></q-item-tile>
    </q-item-main>
    <q-item-side right>
      <small>{{item['proxy.source'] === 0 ? 'incoming' : `target ${item['proxy.source']}`}}</small><q-icon class="q-ml-xs" :color="item['proxy.source'] === 0 ? 'green' : 'yellow'" :name="item['proxy.source'] === 0 ? 'mdi-arrow-right-thick' : item['proxy.event'] === 1 ? 'mdi-arrow-right-thick' : 'mdi-arrow-left-thick'"/>
    </q-item-side>
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
    'selected'
  ],
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
  methods: {
    clickHandler (index, type, content) {
      this.$emit(`action`, {index, type, content})
    },
    itemClickHandler (index, content, event) {
      this.$emit(`item-click`, {index, content, event})
    }
  }
}
</script>

<style lang="stylus">
</style>
