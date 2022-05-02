<template>
  <q-btn color="white" icon="mdi-filter-variant" flat dense rounded>
    <q-tooltip>Filter by event type</q-tooltip>
    <q-menu anchor="top right" self="top right" content-class="bg-grey-9" no-route-dismiss>
      <div class="q-py-sm" style="max-width: 400px; max-height: calc(50vh - 50px)">
        <div class="text-white text-weight-bold q-ml-sm">Basic</div>
        <div v-for="item in baseOptions" :key="item.value" class="filter-menu__item q-pl-sm cursor-pointer" @click="add('event_code', item.value)">
          <span :class="[`text-${getLogItemColor(item.value)}`]">{{item.label}}</span>
        </div>
        <div v-if="entityOptions.length">
          <div class="text-white text-weight-bold q-mt-xs q-ml-sm">Specific for {{entity}}</div>
          <template v-for="item in entityOptions">
            <div :key="item.value" class="filter-menu__item q-pl-sm cursor-pointer" @click="add('event_code', item.value)">
              <span :class="[`text-${getLogItemColor(item.value)}`]">{{item.label}}</span>
            </div>
            <div v-if="item.value === 102 || item.value === 301" :key="item.value + 'close'">
              <div v-for="(closeItem, index) in closeCodes" :key="index" class="filter-menu__item q-pl-lg cursor-pointer" @click="addComplex('event_code', item.value, 'close_code', closeItem.code)">
                <span :class="[`text-${getLogItemColor(item.value, closeItem.code)}`]">{{closeItem.description}}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script>
import ItemMixin from './ItemMixin'

export const CLOSE_CODES = {
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
    13: true,
    14: true,
    15: true,
    16: true,
    17: true,
    18: true,
    19: true
}

export default {
  props: ['filter', 'entity'],
  mixins: [ItemMixin],
  data () {
    return {
      baseEvents: [],
      entityEvents: [],
      baseOptions: [],
      entityOptions: [],
      closeCodes: []
    }
  },
  methods: {
    add (name, code) {
      // const filter = this.filter ? `(${this.filter})||${name}==${code}` : `${name}==${code}`
      const filter = `${name}==${code}`
      this.$emit('update', filter)
    },
    addComplex (mainName, mainCode, extName, extCode) {
      const event = `${mainName}==${mainCode}&&${extName}==${extCode}`
      // const filter = this.filter ? `(${this.filter})||(${event})` : event
      const filter = event
      this.$emit('update', filter)
    }
  },
  created () {
    const logsObject = this.$store.state.logsObject
    this.baseEvents = logsObject.entities.base
    this.entityEvents = logsObject.entities[this.entity]
    this.baseOptions = this.baseEvents.map(code => ({ label: logsObject.codes[code].description, value: code }))
    this.entityOptions = this.entityEvents.map(code => ({ label: logsObject.codes[code].description, value: code }))
    const DEVICE_LOG_CODE_WITH_ERRORS = 102
    this.closeCodes = Object.values(logsObject.codes[DEVICE_LOG_CODE_WITH_ERRORS].extra_codes).filter(closeCode => CLOSE_CODES[closeCode.code])
  }
}
</script>

<style scoped lang="stylus">
  .filter-menu__item
    &:hover
      background $grey-8
</style>
