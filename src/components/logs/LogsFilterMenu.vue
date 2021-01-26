<template>
  <q-btn color="white" icon="mdi-filter-variant" flat dense rounded>
    <q-tooltip>Filter by event type</q-tooltip>
    <q-menu anchor="top right" self="top right">
      <div class="bg-grey-9 q-pa-sm">
        <q-radio v-model="model" :val="-1" dense dark color="white" size="xs" class="q-ml-xs">
          <span class="text-grey-3">All events</span>
        </q-radio>
        <div class="text-white text-weight-bold q-mt-xs">Basic</div>
        <div v-for="item in baseOptions" :key="item.code" class="q-pl-xs">
          <q-radio v-model="model" :val="item.value" dense dark color="white" size="xs">
            <span :class="[getLogItemColor(item.value)]">{{item.label}}</span>
          </q-radio>
        </div>
        <div v-if="entityOptions.length">
          <div class="text-white text-weight-bold q-mt-xs">Specific for {{entity}}</div>
          <div v-for="item in entityOptions" :key="item.code" class="q-pl-xs">
            <q-radio v-model="model" :val="item.value" dense dark color="white" size="xs">
              <span :class="[getLogItemColor(item.value)]">{{item.label}}</span>
            </q-radio>
            <div v-if="item.value === 102 || item.value === 301" class="q-pl-md">
              <div v-for="(closeItem, key) in closeCodes" :key="closeItem">
                <q-radio v-model="closeCode" :val="+key" dense dark color="white" size="xs" :disable="!(model === 102 || model === 301)">
                  <span :class="[getLogItemColor(item.value, +key)]">{{closeItem}}</span>
                </q-radio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script>
import events from './events.json'
import ItemMixin from './ItemMixin'
export default {
  props: ['filter', 'entity'],
  mixins: [ItemMixin],
  data () {
    const baseEvents = events.codesByEntities.base,
      entityEvents = events.codesByEntities[this.entity],
      titles = events.types,
      closeCodes = {
        2: 'connection closed by tracking device',
        3: 'connection successfully processed and closed',
        4: 'received data violates channel\'s protocol',
        5: 'internal error',
        6: 'data parsing error',
        7: 'connection closed due to server maintenance',
        8: 'protocol implementation updated',
        9: 'channel\'s parameters changed',
        10: 'connection closed upon user\'s request',
        11: 'outgoing connection failed',
        12: 'Current connection closed because of ident collision',
        13: 'device is blocked',
        14: 'password mismatch',
        15: 'device associated with the connection was created, changed or deleted',
        16: 'channel rejected connection due to IP addresses whitelist missmatch'
      }
    const values = this.getValues()
    return {
      baseOptions: baseEvents.map(code => ({ label: titles[code], value: code })),
      entityOptions: entityEvents.map(code => ({ label: titles[code], value: code })),
      model: values.event,
      closeCode: values.close,
      closeCodes,
      currentFilter: this.filter
    }
  },
  methods: {
    getValues () {
      const filter = this.filter
      const value = {
        event: undefined,
        close: 0
      }
      if (!filter || (filter && filter.indexOf('event_code') === -1)) {
        value.event = -1
      } else {
        const eventStr = filter.split(/\||,|&/g).filter(str => str.trim().indexOf('event_code') === 0).map(str => str.split('=')[1])
        const closeStr = filter.split(/\||,|&/g).filter(str => str.trim().indexOf('close_code') === 0).map(str => str.split('=')[1])
        value.event = +eventStr
        value.close = +closeStr
      }
      return value
    },
    generateFilter (fieldName, value) {
      let filter
      if (!this.currentFilter) {
        if (value && value !== -1) {
          filter = `${fieldName}=${value}`
        }
      } else if (this.currentFilter && this.currentFilter.indexOf(fieldName) === -1) {
        if (value && value !== -1) {
          filter = `${this.currentFilter}${this.currentFilter ? ',' : ''}${fieldName}=${value}`
        }
      } else {
        if (!value || value === -1) {
          filter = this.currentFilter.split(/\||,|&/g).reduce((res, str) => {
            if (str.trim().indexOf(fieldName) === 0) {
              return res
            }
            res = `${res}${res ? ',' : ''}${str}`
            return res
          }, '')
        } else {
          filter = this.currentFilter.split(/\||,|&/g).reduce((res, str) => {
            if (str.trim().indexOf(fieldName) === 0) {
              str = `${fieldName}=${value}`
            }
            res = `${res}${res ? ',' : ''}${str}`
            return res
          }, '')
        }
      }
      this.currentFilter = filter
    }
  },
  watch: {
    filter (filter) {
      const values = this.getValues()
      this.model = values.event
      this.closeCode = values.close
      this.currentFilter = filter
    },
    model (value) {
      if (value !== 102 || value !== 301) {
        this.closeCode = 0
        this.generateFilter('close_code', 0)
      }
      this.generateFilter('event_code', value)
      this.$emit('update', this.currentFilter)
    },
    closeCode (value) {
      if (!value) { return false }
      this.generateFilter('close_code', value)
      this.$emit('update', this.currentFilter)
    }
  }
}
</script>
