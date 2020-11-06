<template>
  <q-page>
    <entities-toolbar :item="selectedItem">
      <div class="flex" :class="{'middle-modificator': !active}" slot="selects">
        <div style="display: inline-flex;" :style="{maxWidth:  needShowBackToChannel && needShowBackToDevice ? 'calc(100% - 150px)' : needShowBackToChannel || needShowBackToDevice ? 'calc(100% - 80px)' : '100%'}">
          <q-select
            ref="itemSelect"
            class="items__select"
            :class="{'items__select--no-selected': !active}"
            :value="active"
            :options="filteredItems"
            filled
            :label="active ? 'Channel' : 'SELECT CHANNEL'"
            dark hide-bottom-space dense color="white"
            :disable="!isNeedSelect"
            :hide-dropdown-icon="!isNeedSelect"
            popup-content-class="items__popup"
            :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + 48}px`}"
            @filter="(filter, update) => filterItems('channels', filter, update)"
          >
            <div slot="before-options" class="bg-dark q-pa-xs select__filter">
              <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" autofocus>
                <q-icon slot="prepend" name="mdi-magnify" color="white" />
              </q-input>
            </div>
            <template v-slot:no-option>
              <div>
                <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" class="q-ma-xs" autofocus>
                  <q-icon slot="prepend" name="mdi-magnify" color="white" />
                </q-input>
                <div class="text-center">No results</div>
              </div>
            </template>
            <template v-slot:selected-item="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                class="q-pa-none"
                style="min-height: 20px; margin-top: 2px; max-width: 100%"
                v-if="selectedItem"
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-none text-white">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-label>
                  <q-item-label class="q-pa-none q-mt-none text-white ellipsis" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{selectedItem.uri || '&lt;no uri&gt;'}}</small></q-item-label>
                </q-item-section>
                <q-item-section class="text-white" side>
                  <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope" v-if="filteredItems.length">
              <q-item
                v-bind="scope.itemProps"
                @click="active = scope.opt.id"
                v-on="scope.itemEvents"
                class="q-pa-xs"
                clickable
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-xs">{{scope.opt.name || '&lt;noname&gt;'}}</q-item-label>
                  <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.uri || '&lt;no uri&gt;'}}</small></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <transition-group appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn key="channel" v-if="needShowBackToChannel" title="View channels" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" style="width: 60px;" @click="viewLogsHandler" flat dense>
            <q-icon size="1.5rem" color="white" name="merge_type"/>
            <div style="font-size: .7rem; line-height: .7rem;">Channel</div>
          </q-btn>
          <q-btn key="device" v-if="needShowBackToDevice" title="View devices" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" style="width: 60px;" @click="goToDevice" flat dense>
            <q-icon size="1.5rem" color="white" name="mdi-developer-board"/>
            <div style="font-size: .7rem; line-height: .7rem;">Device</div>
          </q-btn>
        </transition-group>
      </div>
    </entities-toolbar>
    <traffic-viewer
      v-if="active"
      :active="active"
      :active-device="activeDevice"
      :isVisibleToolbar="isVisibleToolbar"
      :device-closeble="needShowBackToChannel"
      :config="config"
      class="flex"
      @change-active-device="changeActiveDeviceHandler"
    />
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg" style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Compatible channels not found'}}</div>
  </q-page>
</template>

<script>
import TrafficViewer from '../../components/trafficViewer/Index'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import { mapState } from 'vuex'
import init from '../../mixins/entitiesInit'
import get from 'lodash/get'

export default {
  name: 'PageTrafficViewer',
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [init],
  data () {
    return {
      active: null,
      activeDevice: null,
      relatedDeviceId: null,
      isInit: false,
      isItemsInit: false,
      filter: '',
      prevEntity: null,
      isIntegration: this.$q.platform.within.iframe
    }
  },
  computed: {
    ...mapState({
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      items (state) {
        return Object.values(state.channels || {}).filter(item => state.channelsProtocols[item.protocol_id].features.raw_packets)
      }
    }),
    filteredItems () {
      const filter = this.filter.toLowerCase()
      const filteredItems = this.filter ? this.items.filter(item => {
        return (
          item &&
          typeof item.name !== 'undefined' &&
          item.name !== null &&
          item.name.toLowerCase().indexOf(filter) >= 0
        ) ||
        (
          item &&
          typeof item.id !== 'undefined' &&
          item.id !== null &&
          (item.id + '').indexOf(filter) >= 0
        )
      }) : this.items
      filteredItems.sort((l, r) => {
        if (!l.name) { return -1 }
        if (!r.name) { return 1 }
        const lName = l.name.toLowerCase()
        const rName = r.name.toLowerCase()
        if (lName < rName) {
          return -1
        } else if (lName > rName) {
          return 1
        }
        return 1
      })
      return filteredItems
    },
    selectedItem () {
      return this.items.filter(item => item.id === this.active)[0] || null
    },
    needShowBackToChannel () {
      return this.active && (!this.isIntegration || (this.isIntegration && ((this.prevEntity === 'channels' && !this.isNeedSelect) || this.isNeedSelect)))
    },
    needShowBackToDevice () {
      return (this.active && this.activeDevice && this.relatedDeviceId) && (!this.isIntegration || (this.isIntegration && ((this.prevEntity === 'devices' && !this.isNeedSelect) || this.isNeedSelect)))
    }
  },
  methods: {
    changeActiveDeviceHandler (device) {
      this.setActiveDevice(device)
      if (this.active) {
        if (this.activeDevice) {
          this.$router.push(`/tools/traffic/${this.active}/ident/${device.ident}`).catch(err => err)
        } else {
          this.$router.push(`/tools/traffic/${this.active}`).catch(err => err)
        }
      } else {
        this.$router.push('/tools/traffic').catch(err => err)
      }
    },
    unselect () {
      this.$refs.messages.unselect()
    },
    viewLogsHandler () {
      this.$router.push(`/channels/${this.active}`).catch(err => err)
    },
    setActiveDevice (device) {
      this.activeDevice = device
      this.getRelatedDeviceId()
    },
    getRelatedDeviceId () {
      if (!this.activeDevice) {
        this.relatedDeviceId = null
        return
      }
      this.$connector.gw.getChannelProtocolsDeviceTypes(this.selectedItem.protocol_id, 'all', { fields: 'id' })
        .then((data) => {
          const types = get(data, 'data.result', [])
          return types.map(type => type.id)
        })
        .then(typeIds => {
          this.$connector.gw.getDevices(`configuration.ident=${this.activeDevice.ident}`, { fields: 'id,device_type_id' })
            .then(devicesData => {
              const devices = get(devicesData, 'data.result', [])
              const relatedDeviceId = devices.reduce((result, device) => {
                if (result) { return result }
                if (typeIds.includes(device.device_type_id)) {
                  return device.id
                }
                return result
              }, 0)
              this.relatedDeviceId = relatedDeviceId
            })
        })
    },
    goToDevice () {
      this.$router.push(`/devices/${this.relatedDeviceId}`).catch(err => err)
    },
    init () {
      const entity = 'tools/traffic'
      const activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined)
      this.isInit = true
      if (this.$route.params && this.$route.params.id) {
        if (this.items.filter(item => item.id === Number(this.$route.params.id)).length) {
          this.active = Number(this.$route.params.id)
          if (this.$route.params.ident) {
            this.setActiveDevice({ ident: this.$route.params.ident })
          }
        } else {
          this.active = null
        }
      } else if (activeFromLocaleStorage && this.items.filter(item => item.id === activeFromLocaleStorage).length) {
        this.active = activeFromLocaleStorage
      }
      this.$emit('inited')
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevEntity = from.meta.moduleName
    })
  },
  watch: {
    $route (route) {
      if (route.params && route.params.id) {
        if (this.items.filter(item => item.id === Number(route.params.id)).length) {
          this.active = Number(route.params.id)
          if (this.$route.params.ident) {
            this.setActiveDevice({ ident: this.$route.params.ident })
          }
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      const currentItem = this.items.filter(item => item.id === val)[0] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'tools/traffic' }, value: currentItem.id })
        if (this.activeDevice) {
          this.$router.push(`/tools/traffic/${val}/ident/${this.activeDevice.ident}`).catch(err => err)
        } else {
          this.$router.push(`/tools/traffic/${val}`).catch(err => err)
        }
      } else {
        this.$router.push('/tools/traffic').catch(err => err)
      }
    }
  },
  components: { TrafficViewer, EntitiesToolbar }
}
</script>
<style lang="stylus">
  .middle-modificator
    position absolute
    left calc(50% - 71px)
  .items__select
    max-width 100%
    &--no-selected
      width 180px
      .q-field__marginal
        height auto!important
    .q-field__marginal
      height 48px
  .items__popup
    .select__filter
      position sticky
      top 0
      z-index 1
  .items__filter
    min-width 250px
    border 1px solid $grey-9
    border-radius 3px
  .cheap-modifier
    font-size .6rem
    font-weight bolder
    border-radius 3px
    background-color #90a4ae
    color white
    padding 0 2px
    width 45px
    position absolute
    top -10px
    right 0px
    &--item
      top 5px
    &--mobile
      right 7px
</style>
