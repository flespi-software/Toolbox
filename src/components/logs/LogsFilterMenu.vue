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
              <div v-for="(closeItem, key) in closeCodes" :key="closeItem" class="filter-menu__item q-pl-lg cursor-pointer" @click="addComplex('event_code', item.value, 'close_code', key)">
                <span :class="[`text-${getLogItemColor(item.value, +key)}`]">{{closeItem}}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script>
import events from './events.json'
import ItemMixin from './ItemMixin'

const baseEvents = events.codesByEntities.base,
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
    12: 'current connection closed because of ident collision',
    13: 'device is blocked',
    14: 'authentication failed',
    15: 'device associated with the connection was created, changed or deleted',
    16: 'channel rejected connection due to IP addresses whitelist mismatch',
    17: 'connection is closed by inactivity timeout',
    18: 'unsupported protocol part',
    19: 'protocol mismatch'
  }

export default {
  props: ['filter', 'entity'],
  mixins: [ItemMixin],
  data () {
    const entityEvents = events.codesByEntities[this.entity]
    return {
      baseEvents,
      entityEvents,
      baseOptions: baseEvents.map(code => ({ label: titles[code], value: code })),
      entityOptions: entityEvents.map(code => ({ label: titles[code], value: code })),
      closeCodes
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
  }
}
</script>

<style scoped lang="stylus">
  .filter-menu__item
    &:hover
      background $grey-8
</style>
