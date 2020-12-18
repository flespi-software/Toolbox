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
      titles = events.types
    return {
      baseOptions: baseEvents.map(code => ({ label: titles[code], value: code })),
      entityOptions: entityEvents.map(code => ({ label: titles[code], value: code })),
      model: this.getValues()
    }
  },
  methods: {
    getValues () {
      const filter = this.filter
      let value
      if (!filter || (filter && filter.indexOf('event_code') === -1)) {
        value = -1
      } else {
        const filterStr = filter.split(/\||,|&/g).filter(str => str.trim().indexOf('event_code') === 0).map(str => str.split('=')[1])
        value = +filterStr
      }
      return value
    },
    generateFilter (value) {
      let filter
      if (!this.filter) {
        if (value && value !== -1) {
          filter = `event_code=${value}`
        }
      } else if (this.filter && this.filter.indexOf('event_code') === -1) {
        if (value && value !== -1) {
          filter = `${this.filter}${this.filter ? ',' : ''}event_code=${value}`
        }
      } else {
        if (!value || value === -1) {
          filter = this.filter.split(/\||,|&/g).reduce((res, str) => {
            if (str.trim().indexOf('event_code') === 0) {
              return res
            }
            res = `${res}${res ? ',' : ''}${str}`
            return res
          }, '')
        } else {
          filter = this.filter.split(/\||,|&/g).reduce((res, str) => {
            if (str.trim().indexOf('event_code') === 0) {
              str = `event_code=${value}`
            }
            res = `${res}${res ? ',' : ''}${str}`
            return res
          }, '')
        }
      }
      this.$emit('update', filter)
    }
  },
  watch: {
    filter (filter) {
      this.model = this.getValues()
    },
    model (value) {
      this.generateFilter(value)
    }
  }
}
</script>
