<template>
  <q-page>
    <entities-toolbar
      :item="selectedItem" :ratio="ratio" :actions="actions" @change-ratio="r => ratio = r">
      <div class="flex" :class="{'middle-modificator': !active}" style="max-width: 50%" slot="selects">
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          filled
          :hide-dropdown-icon="!isNeedSelect || (typeof isNeedSelect === 'string' && isNeedSelect.indexOf('devices') > -1)"
          :label="active ? 'Device' : 'SELECT DEVICE'"
          dark hide-bottom-space dense color="white"
          :disable="!isNeedSelect || (typeof isNeedSelect === 'string' && isNeedSelect.indexOf('devices') > -1)"
          :virtual-scroll-item-size="48"
          :virtual-scroll-slice-size="6"
          :virtual-scroll-sticky-size-start="48"
          :virtual-scroll-sticky-size-end="needShowGetDeletedAction && tokenType === 1 ? 29 : 0"
          popup-content-class="items__popup"
          :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + (needShowGetDeletedAction && tokenType === 1 ? 77 : 48) + (filteredItems.length ? 0 : 4)}px`}"
          @filter="filterItems"
        >
          <div slot="before-options" class="bg-dark q-pa-xs select__filter">
            <q-input v-model="filter" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" @input="filter => $refs.itemSelect.filter(filter)" autofocus>
              <q-icon slot="prepend" name="mdi-magnify" color="white" />
            </q-input>
          </div>
          <div slot="after-options" class="select__get-deleted" v-if="needShowGetDeletedAction && tokenType === 1">
            <q-btn icon="mdi-download" class="deleted-action" @click.prevent.stop="getDeletedHandler">see deleted</q-btn>
          </div>
          <template v-slot:no-option>
            <div style="min-height: 77px;">
              <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" class="q-ma-xs" autofocus>
                <q-icon slot="prepend" name="mdi-magnify" color="white" />
              </q-input>
              <div class="text-center">No results</div>
            </div>
          </template>
          <template v-slot:selected-item="scope">
            <q-item
              v-if="selectedItem"
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              class="q-pa-none"
              style="min-height: 20px; margin-top: 2px; max-width: 100%"
            >
              <q-item-section>
                <q-item-label header class="ellipsis overflow-hidden q-pa-none text-white">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-white ellipsis" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{selectedItem.configuration && selectedItem.configuration.ident ? selectedItem.configuration.ident : `&lt;no ident&gt;`}}</small></q-item-label>
              </q-item-section>
              <q-item-section class="text-white" side>
                <q-item-label v-if="selectedItem.deleted" class="q-pa-none text-right"><small class="cheap-modifier">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              @click="active = scope.opt.id"
              v-on="scope.itemEvents"
              :class="{'text-grey-8': scope.opt.deleted}"
              class="q-pa-xs"
              clickable
            >
              <q-item-section>
                <q-item-label header class="ellipsis overflow-hidden q-pa-xs">{{scope.opt.name || '&lt;noname&gt;'}}</q-item-label>
                <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.configuration && scope.opt.configuration.ident ? scope.opt.configuration.ident : `&lt;no ident&gt;`}}</small></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item" :class="{'cheap-modifier--mobile': $q.platform.is.mobile}">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp" v-if="$q.platform.is.desktop && selectedItem && !selectedItem.deleted">
          <q-btn title="Traffic hex payload" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" v-if="trafficRoute" @click="trafficViewHandler" flat dense style="width: 50px;">
            <q-icon size="1.5rem" color="white" name="mdi-download-network-outline"/>
            <div style="font-size: .7rem; line-height: .7rem">Traffic</div>
          </q-btn>
        </transition>
      </div>
    </entities-toolbar>
    <div v-if="isInit && active">
      <logs
        ref="logs"
        :item="selectedItem"
        :limit="limit"
        originPattern="gw/devices/:id"
        :isEnabled="!!+size[0]"
        v-if="+size[0]"
        :style="[{height: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, {maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'top' ? '66%' : ''}]"
        @view-log-message="viewLogMessagesHandler"
        @to-traffic="toTrafficHandler"
        :config="logsConfig"
      />
      <messages
        ref="messages"
        @view-data="viewDataHandler"
        @on-map="onMapHandler"
        :item="selectedItem"
        :activeId="active"
        :isEnabled="!!+size[1]"
        :limit="limit"
        v-if="+size[1]"
        :style="[{height: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, {maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'bottom' ? '66%' : ''}]"
        :config="config.messages"
      />
    </div>
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Devices not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
    <map-frame
      ref="map"
      v-if="active && trackByMessages.length && isVisibleMap"
      :device="selectedItem"
      :siblingHeight="siblingHeight"
      @map:close="isVisibleMap = false"
      @map:minimize="mapMinimizeHandler"
    />
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import messages from '../../components/messages/devices/Index.vue'
import MapFrame from '../../components/MapFrame'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import { mapState, mapActions } from 'vuex'
import init from '../../mixins/entitiesInit'
import get from 'lodash/get'

const MAP_MODE_TRACK = 0,
  MAP_MODE_MARKER = 1

export default {
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
      filter: '',
      active: null,
      ratio: 50,
      isInit: false,
      isItemsInit: false,
      isVisibleMap: false,
      mapMinimizedOptions: {},
      siblingHeight: null,
      needShowGetDeletedAction: true,
      trafficRoute: null,
      mapMode: MAP_MODE_TRACK
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        const hasntMessages = this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length && this.ratio !== 100,
          hasntLogs = this.config.logs && state[this.config.logs.vuexModuleName] && state[this.config.logs.vuexModuleName].messages && !state[this.config.logs.vuexModuleName].messages.length && this.ratio !== 0
        return hasntMessages && hasntLogs
      },
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      itemsCollection (state) {
        return state.devices || {}
      },
      tasksByDevice (state) {
        return Object.values(state.tasks || {})
      },
      trackByMessages (state) {
        const messages = this.config && this.config.messages && state[this.config.messages.vuexModuleName]
            ? state[this.config.messages.vuexModuleName].messages
            : [],
          track = []
        for (let i = 0; i < messages.length; i++) {
          const message = messages[i]
          if (!!message['position.latitude'] && !!message['position.longitude']) {
            track.push(
              {
                lat: message['position.latitude'],
                lon: message['position.longitude'],
                dir: message['position.direction']
              }
            )
          }
        }
        if (this.isVisibleMap && this.$refs.map && this.mapMode === MAP_MODE_TRACK) { this.updateTrack(track) }
        return track
      }
    }),
    items () {
      return Object.values(this.itemsCollection)
    },
    selectedItem () {
      const item = (this.itemsCollection && this.itemsCollection[this.active]) || null
      if (item) {
        item.deleted && this.deletedHandler()
        this.getTrafficRoute(item)
      }
      return item
    },
    logsConfig () {
      const config = this.config.logs
      if (this.trafficRoute) {
        config.itemSettings.needTrafficRoute = true
      } else {
        config.itemSettings.needTrafficRoute = false
      }
      return config
    },
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
        ) ||
        (
          item && item.configuration &&
          typeof item.configuration.ident !== 'undefined' &&
          item.configuration.ident !== null &&
          item.configuration.ident.toLowerCase().indexOf(filter) >= 0
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
    size () {
      return [this.ratio, 100 - this.ratio]
    },
    actions () {
      return [
        {
          label: 'Intervals',
          icon: 'mdi-set-center',
          handler: () => this.moveToIntervals(this.active, null),
          condition: !!this.tasksByDevice.length
        },
        {
          label: 'Traffic',
          icon: 'mdi-download-network-outline',
          handler: this.trafficViewHandler,
          condition: this.trafficRoute && this.$q.platform.is.mobile
        },
        {
          label: 'Map',
          icon: 'mdi-map',
          handler: () => this.showTrack(this.trackByMessages),
          condition: !!this.trackByMessages.length
        },
        {
          label: 'Clear',
          icon: 'mdi-playlist-remove',
          handler: this.clearHandler,
          condition: !this.isEmptyMessages
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getDeleted', 'getDeviceTrafficRoute']),
    filterItems (filter, update) {
      if (this.isItemsInit) {
        update()
        return
      }
      const entity = 'devices'
      this.itemsLoad(entity, update, this.active, () => { this.isItemsInit = true })
    },
    viewDataHandler (content) {
      this.$emit('view-data', content)
      if (this.isVisibleMap && content['position.latitude'] && content['position.longitude']) {
        this.onMapHandler({ content })
      }
    },
    viewLogMessagesHandler (content) {
      this.$emit('view-log-message', content)
    },
    unselect () {
      this.$refs.messages.unselect()
    },
    mapMinimizeHandler (options) {
      this.mapMinimizedOptions = options
      if (options.type === 'bottom') {
        this.siblingHeight = this.size[1]
      } else if (options.type === 'top') {
        this.siblingHeight = this.size[0]
      } else { this.siblingHeight = null }
    },
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true
      }).onOk(() => {
        this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`)
        this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
      })
        .onCancel(() => {})
    },
    async getDeletedHandler () {
      await this.getDeleted('devices')
      this.needShowGetDeletedAction = false
      this.$refs.itemSelect.reset()
    },
    clearActive () {
      this.active = null
    },
    deletedHandler () {
      this.ratio = 100
    },
    getTrafficRoute (device) {
      this.trafficRoute = null
      const ident = device.configuration ? device.configuration.ident : ''
      if (!ident) { return false }
      this.getDeviceTrafficRoute({ id: device.id, ident })
        .then(route => { this.trafficRoute = route })
    },
    trafficViewHandler () {
      this.$router.push(this.trafficRoute).catch(err => err)
    },
    toTrafficHandler ({ content }) {
      const ident = content.ident,
        timeEnd = Math.floor(content.timestamp * 1000),
        timeStart = timeEnd - 10000
      if (ident) {
        this.$router.push({ path: this.trafficRoute, query: { from: timeStart, to: timeEnd } }).catch(err => err)
      }
    },
    init () {
      const entity = 'devices',
        activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined)
      let idFromRoute = this.$route.params && this.$route.params.id ? this.$route.params.id : null
      this.isInit = true
      if (idFromRoute) {
        idFromRoute = Number(idFromRoute)
        if (this.itemsCollection[idFromRoute]) {
          this.active = idFromRoute
        } else {
          this.active = null
        }
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        this.active = activeFromLocaleStorage
      }
      // deleted item logic
      if (this.selectedItem && this.selectedItem.deleted) {
        this.deletedHandler()
      }
      this.$emit('inited')
    },
    moveToIntervals (deviceId, calcId) {
      this.$nextTick(() => { this.$router.push(`/device/${deviceId}/calc/${calcId}/intervals?noselect=devices`).catch(err => err) })
    },
    setMapVisibility (flag) {
      this.isVisibleMap = flag
    },
    showTrack (track) {
      this.mapMode = MAP_MODE_TRACK
      if (!this.isVisibleMap && track.length) {
        this.setMapVisibility(true)
      }
      this.$nextTick(() => this.updateTrack(track))
    },
    updateTrack (track) {
      const marker = { latlng: [track[track.length - 1].lat, track[track.length - 1].lon], direction: track[track.length - 1].dir }
      track = track.map(marker => ([marker.lat, marker.lon]))
      this.$refs.map.clear().addPoints(track).addNamedMarkers([marker]).send()
    },
    onMapHandler ({ index, content }) {
      const marker = [content['position.latitude'], content['position.longitude']]
      this.mapMode = MAP_MODE_MARKER
      if (!this.isVisibleMap) {
        this.setMapVisibility(true)
        this.$nextTick(() => {
          this.$refs.map.clear().autobounds(true).addMarkers([marker]).send()
        })
        return false
      }
      if (this.$refs.map && this.isVisibleMap) {
        this.$refs.map.clear().addMarkers([marker]).centerMap(marker).send()
      }
    }
  },
  watch: {
    ratio (val) {
      this.$nextTick(() => {
        if (+this.size[0] && this.active) {
          this.$refs.logs.resetParams()
        }
        if (+this.size[1] && this.active) {
          this.$refs.messages.resetParams()
        }
      })
    },
    $route (route) {
      if (route.params && route.params.id) {
        if (this.itemsCollection[Number(route.params.id)]) {
          this.active = Number(route.params.id)
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val, old) {
      const currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'devices' }, value: currentItem.id })
        this.$router.push(`/devices/${val}`).catch(err => err)
      } else {
        this.$router.push('/devices').catch(err => err)
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      } else {
        this.ratio = currentItem.deleted ? 100 : 50
      }
    }
  },
  components: { logs, messages, MapFrame, EntitiesToolbar }
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
    .select__get-deleted
      position sticky
      bottom 0
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
  .deleted-action
    width 100%
    color #eee
    background-color #999
    font-size .7rem
    padding-top 0
    padding-bottom 0
</style>
