<template>
  <q-item  @click="(event) => { itemClickHandler(index, item, event) }" clickable>
    <q-item-section>
      <q-item-label header class="q-pa-none text-white">{{peer}}</q-item-label>
      <q-item-label class="ellipsis text-grey-6" style="font-size: 0.7rem" caption>{{ident}}</q-item-label>
      <q-item-label class="ellipsis text-grey-6" caption>{{date.formatDate(timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}}</q-item-label>
    </q-item-section>
    <q-item-section side>
      {{`${item.messages.length} events`}}
    </q-item-section>
  </q-item>
</template>

<script>
import { date } from 'quasar'

export default {
  props: [
    'item',
    'index',
    'itemHeight',
    'actions'
  ],
  data () {
    return {
      date: date,
      timestamp: this.item.messages[0].timestamp,
      ident: this.item.messages[0].ident,
      peer: this.item.peer
    }
  },
  methods: {
    itemClickHandler (index, content, event) {
      this.$emit(`item-click`, { index, content, event })
    }
  }
}
</script>

<style lang="stylus">
  .list__item
    display inline-block
    white-space nowrap
    margin 0 10px 0 5px
    text-overflow ellipsis
    overflow hidden
  .message-viewer .q-w-list>.missed-items
    background-color rgba(255,255,255,.05)
    &:nth-child(odd)
      background-color rgba(255,255,255,.1)
</style>
