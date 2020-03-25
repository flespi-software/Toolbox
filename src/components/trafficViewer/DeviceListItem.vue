<template>
  <q-item  @click="(event) => { itemClickHandler(index, item, event) }" clickable class="q-py-none">
    <q-item-section>
      <q-item-label header class="ellipsis text-white">{{ident}}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { date } from 'quasar'

export default {
  props: [
    'item',
    'index',
    'itemHeight'
  ],
  data () {
    return {
      date: date,
      ident: this.item.ident
    }
  },
  methods: {
    itemClickHandler (index, content, event) {
      this.$emit('item-click', { index, content, event })
    }
  }
}
</script>

<style lang="stylus">
</style>
