<template>
  <div style="height: 100%">
    <q-item dense dark v-if="highlightType && item['server.timestamp']" href="https://flespi.com/kb/toolbox-guide#colors" target="_blank" :class="`text-white ${item['server.timestamp'] - item.timestamp < 0 ? 'bg-orange-9' : 'bg-grey-9'} rounded-borders q-pr-none q-pl-sm`" :title="highlightExplanation || ''">
      <q-item-section avatar style="min-width:30px;padding-right:0">
        <q-icon name="mdi-alert" />
      </q-item-section>
      <q-item-section class="q-px-xs">
        <q-item-label class="text-bold">{{highlightDescription}}</q-item-label>
        <q-item-label caption title="Mesaage received time">{{formatDate(item['server.timestamp'] * 1000, 'YYYY-MM-DD HH:mm:ss.SSS')}} ({{Math.floor(item['server.timestamp'] - item.timestamp) * -1}} s.)</q-item-label>
      </q-item-section>
    </q-item>
    <div class="text-h6 text-white text-center">
      Plugin processing
    </div>
    <q-list separator dark>
      <q-item>
        <q-item-section side>
          <q-icon name="mdi-mail" color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold">
            Message received
          </q-item-label>
          <q-item-label caption>
            {{ formatDate(item['server.timestamp'] * 1000, 'YYYY-MM-DD HH:mm:ss.SSS') }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <div :key="item['server.timestamp'] + 'arrow'" class="q-pl-md flow-arrow">
        <q-icon name="mdi-arrow-down" size="sm" color="grey" />
      </div>
      <div v-if="loading" class="text-h6 text-grey text-center" >
        Loading...
      </div>
      <template v-for="(log) in logs">
        <q-item
          :key="log.timestamp + '-' + log.origin_id"
        >
          <q-item-section side>
            <q-icon name="mdi-puzzle" color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">
              {{ plugins[log.origin_id] || `#${log.origin_id}` }}
            </q-item-label>
            <q-item-label caption>
              {{ formatDate(log.timestamp * 1000, 'YYYY-MM-DD HH:mm:ss.SSS') }}
            </q-item-label>
            <q-item-label caption class="text-red" v-if="log.error_text">
              {{ log.error_text }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <div :key="log.timestamp + '-' + log.origin_id + 'arrow'" class="q-pl-md flow-arrow">
          <q-icon name="mdi-arrow-down" size="sm" color="grey" />
        </div>
      </template>
    </q-list>
  </div>
</template>

<script>
import { date } from 'quasar'

import highlightMessage from './messages/highlightMessageMixin.js'
import Vue from 'vue'
import get from 'lodash.get'

const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})
export default {
  props: ['item', 'meta'],
  data () {
    return {
      search: '',
      plugins: {},
      logs: [],
      loading: false
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
  watch:{
    item (n, o) {
      if (n['device.id'] !== o['device.id']) {
        this.plugins = {}
      }
      this.getPlugins()
    }
  },
  mounted () {
    this.getPlugins()
  },
  methods: {
    formatDate: date.formatDate,
    async getPlugins () {
      try {
        this.logs = []
        this.loading = true
        if (Object.keys(this.plugins).length === 0) {
          const resp = await Vue.connector.http.get(`/gw/devices/${this.item['device.id']}?fields=plugins`)
          let plugins = get(resp, 'data.result.0.plugins', [])
          this.plugins = plugins.reduce((a,v) => ({...a,[v.id]: v.name}),{})
        }
        let ts = this.item['server.timestamp'] || this.item['rest.timestamp']
        let params = {
          reverse: false,
          count: 1,
          filter: 'message_timestamp==' + this.item['timestamp'],
          from: ts,
          to: ts + 600
        }
        const resplogs = await Vue.connector.http.get(`/gw/plugins/${Object.keys(this.plugins).join(',')}/logs?data=${encodeURIComponent(JSON.stringify(params))}`)
        this.logs = get(resplogs, 'data.result', []).sort((a,b) => (a.timestamp > b.timestamp) ? 1 : -1)

        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
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
  .flow-arrow
    margin -7px 0
    &:last-child
      display none
</style>
