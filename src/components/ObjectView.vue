<template>
  <div style="height: 100%">
    <q-item dense dark v-if="highlightType && item['server.timestamp']" href="https://flespi.com/kb/toolbox-guide#colors" target="_blank" :class="`text-white ${item['server.timestamp'] - item.timestamp < 0 ? 'bg-orange-9' : 'bg-grey-9'} rounded-borders q-pr-none q-pl-sm`" :title="highlightExplanation || ''">
      <q-item-section avatar style="min-width:30px;padding-right:0">
        <q-icon name="mdi-alert" />
      </q-item-section>
      <q-item-section class="q-px-xs">
        <q-item-label class="text-bold">{{highlightDescription}}</q-item-label>
        <q-item-label caption title="Mesaage received time">{{formatDate(item['server.timestamp'] * 1000, 'DD/MM/YYYY HH:mm:ss')}} ({{Math.floor(item['server.timestamp'] - item.timestamp) * -1}} s.)</q-item-label>
      </q-item-section>
    </q-item>
    <q-item  class="q-pa-none" style="position: sticky; top: 0px; z-index: 1;">
      <q-item-section class="q-px-sm">
        <q-input type="text" color="white" dark label="Search" v-model="search" class="q-py-none bg-grey-8" outlined dense/>
      </q-item-section>
    </q-item>
    <q-list separator dark>
      <q-item v-if="!Object.keys(item).length || !Object.keys(filteredObject).length">
        <q-item-section>
          <q-item-label header class="ellipsis text-bold text-center text-white">No parameters</q-item-label>
          <q-item-label v-if="!Object.keys(item).length" caption class="ellipsis text-center text-white">Message has not fields</q-item-label>
          <q-item-label v-if="!Object.keys(filteredObject).length && this.search" caption class="ellipsis text-center text-white">Nothing found on your search</q-item-label>
        </q-item-section>
      </q-item>
      <template v-if="Object.keys(filteredObject).length">
        <q-item
          v-for="(key) in Object.keys(filteredObject)" :key="key"
        >
          <q-item-section>
            <q-item-label header class="ellipsis text-bold q-pa-none text-white">
              <span>{{key}}</span>
              <span v-if='meta[key] && meta[key].unit' class="object-viewier__units">, {{meta[key].unit}}</span>
              <q-tooltip>
                <span>{{key}}</span>
                <span v-if='meta[key] && meta[key].unit'>, {{meta[key].unit}}</span>
              </q-tooltip>
            </q-item-label>
            <q-item-label v-if="filteredObject[key] && filteredObject[key].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)" caption><img class="image-bin" :src="filteredObject[key]" :alt="key"></q-item-label>
            <q-item-label v-else-if="key.indexOf('media.image') === 0 || key.indexOf('media.video') === 0" caption><a :href="filteredObject[key].url" target="_blank"><img class="image-bin" :src="filteredObject[key].url + '?preview=jpeg'" :alt="key"></a></q-item-label>
            <q-item-label multiline v-else-if="key.indexOf('image.bin.') === -1" caption class="ellipsis text-white">{{typeof filteredObject[key] !== 'string' ? JSON.stringify(filteredObject[key]) : filteredObject[key]}}<q-tooltip>{{key.indexOf('timestamp') != -1 && typeof filteredObject[key] === 'number' ? formatDate(filteredObject[key] * 1000, 'DD/MM/YYYY HH:mm:ss') : (typeof filteredObject[key] !== 'string' ? JSON.stringify(filteredObject[key]) : filteredObject[key])}}</q-tooltip></q-item-label>
            <q-item-label v-else-if="key.indexOf('image.bin.') === 0" caption><img class="image-bin" :src="`data:image/${key.split('.')[2]};base64, ${filteredObject[key].replace(/^data\:image\/\w*\;base64\,\s/, '')}`" :alt="key"></q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn v-if="meta[key] && meta[key].display" flat dense icon="mdi-table-column-remove" @click="action('col-remove', key)" color='red-3'></q-btn>
            <q-btn v-else flat dense icon="mdi-table-column-plus-after" @click="action('col-add', key)" color="green-3"></q-btn>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script>
import { date } from 'quasar'

import highlightMessage from './messages/highlightMessageMixin.js'

const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
export default {
  props: ['item', 'meta'],
  data () {
    return {
      search: ''
    }
  },
  mixins: [ highlightMessage ],
  computed: {
    filteredObject () {
      return Object.keys(this.item).sort(collator.compare).reduce((acc, key) => {
        if (key.indexOf(this.search) !== -1) {
          acc[key] = this.item[key]
        }
        return acc
      }, {})
    }
  },
  methods: {
    formatDate: date.formatDate,

    action (type, data) {
      this.$emit('action', {
        type,
        data
      })
    }
  }
}
</script>

<style lang="stylus">
  .object-viewier__units
    color $grey-4
    font-size .8rem
  .image-bin
    max-width 100%
</style>
