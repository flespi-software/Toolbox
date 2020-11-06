<template>
  <q-page>
    <q-resize-observer @resize="onResize" />
    <entities-toolbar
      :item="selectedItem" :ratio="ratio" :actions="actions" @change-ratio="r => ratio = r"
    >
      <div class="flex" :class="{'middle-modificator': !active}" slot="selects">
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          :hide-dropdown-icon="!isNeedSelect"
          filled
          :label="active ? 'Channel' : 'SELECT CHANNEL'"
          dark hide-bottom-space dense color="white"
          :disable="!isNeedSelect"
          popup-content-class="items__popup"
          :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 60) + (needShowGetDeletedAction && tokenType === 1 ? 77 : 48)}px`}"
          @filter="(filter, update) => filterItems('channels', filter, update)"
        >
          <div slot="before-options" class="bg-dark q-pa-xs select__filter">
            <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" autofocus>
              <q-icon slot="prepend" name="mdi-magnify" color="white" />
            </q-input>
          </div>
          <div slot="after-options" class="select__get-deleted" v-if="needShowGetDeletedAction && tokenType === 1">
            <q-btn icon="mdi-download" class="deleted-action" @click.prevent.stop="getDeletedHandler">see deleted</q-btn>
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
              v-if="selectedItem"
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              class="q-pa-none"
              style="min-height: 20px; margin-top: 2px; max-width: 100%"
            >
              <q-item-section>
                <q-item-label header class="ellipsis overflow-hidden q-pa-none text-white" style="max-width: 170px;">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-white ellipsis" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{selectedItem.uri || '&lt;no uri&gt;'}}</small></q-item-label>
              </q-item-section>
              <q-item-section class="text-white" side>
                <q-item-label v-if="selectedItem.deleted" class="q-pa-none text-right"><small class="cheap-modifier">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope" v-if="filteredItems.length">
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
                <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{(protocols && protocols[scope.opt.protocol_id]&& protocols[scope.opt.protocol_id].name) || '&lt;no protocol&gt;'}}</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.uri || '&lt;no uri&gt;'}}</small></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item" :class="{'cheap-modifier--mobile': $q.platform.is.mobile}">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp" v-if="$q.platform.is.desktop && selectedItem && !selectedItem.deleted">
          <q-btn title="View hex payload" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" v-if="selectedItem.protocol_id === proxyProtocolId" @click="hexViewHandler" flat dense style="width: 50px;">
            <q-icon size="1.5rem" color="white" name="mdi-matrix"/>
            <div style="font-size: .7rem; line-height: .7rem">HEX</div>
          </q-btn>
          <q-btn title="Traffic hex payload" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" v-else-if="isTrafficViewerSupported" @click="trafficViewHandler" flat dense style="width: 50px;">
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
        :isEnabled="!!+size[0]"
        originPattern="gw/channels/:id"
        :config="logsConfig"
        v-if="+size[0]"
        :style="{height: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'top' ? '66%' : ''}"
        @view-log-message="viewLogMessagesHandler"
        @to-traffic="toTrafficHandler"
      />
      <messages
        ref="messages"
        @view-data="viewDataHandler"
        @on-map="onMapHandler"
        :item="selectedItem"
        :activeId="active"
        :isEnabled="!!+size[1]"
        :limit="limit"
        :config="config.messages"
        v-if="+size[1]"
        :style="{height: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
      />
    </div>
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Channels not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
    <map-frame
      ref="map"
      v-if="isVisibleMap"
      :device="mapDevice"
      :siblingHeight="siblingHeight"
      @map:close="mapCloseHandler"
      @map:minimize="mapMinimizeHandler"
    />
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import messages from '../../components/messages/channels/Index.vue'
import { mapState, mapActions } from 'vuex'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import get from 'lodash/get'
import init from '../../mixins/entitiesInit'
import MapFrame from '../../components/MapFrame'

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
      siblingHeight: 0,
      isVisibleMap: false,
      mapDevice: null,
      mapMinimizedOptions: {},
      isInit: false,
      isItemsInit: false,
      needShowGetDeletedAction: true
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
      protocols (state) { return state.channelsProtocols },
      itemsCollection (state) {
        return state.channels || {}
      },
      proxyProtocolId (state) {
        const protocols = state.channelsProtocols
        return Object.keys(protocols).reduce((res, id) => {
          if (protocols[id].name === 'proxy') {
            res = parseInt(id)
          }
          return res
        }, 0)
      },
      isTrafficViewerSupported () {
        const protocols = this.protocols
        if (!this.selectedItem) { return false }
        const protocolId = this.selectedItem.protocol_id
        const protocol = protocols[protocolId]
        return protocol.features.raw_packets
      }
    }),
    logsConfig () {
      const config = this.config.logs
      if (this.isTrafficViewerSupported) {
        config.itemSettings.needTrafficRoute = true
      } else {
        config.itemSettings.needTrafficRoute = false
      }
      return config
    },
    items () {
      return Object.values(this.itemsCollection)
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
    selectedItem () {
      const item = this.itemsCollection[this.active] || null
      if (item && item.deleted) {
        this.deletedHandler()
      }
      return item
    },
    actions () {
      return [
        {
          label: 'Hex',
          icon: 'mdi-matrix',
          handler: this.hexViewHandler,
          condition: this.selectedItem && this.selectedItem.protocol_id === this.proxyProtocolId && this.$q.platform.is.mobile
        },
        {
          label: 'Traffic',
          icon: 'mdi-download-network-outline',
          handler: this.trafficViewHandler,
          condition: this.isTrafficViewerSupported && this.$q.platform.is.mobile
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
    ...mapActions(['getDeleted']),
    viewDataHandler (content) {
      const message = content[content.length - 1]
      this.$emit('view-data', message)
      if (this.$refs.map && this.isVisibleMap && message['position.latitude'] && message['position.longitude']) {
        this.onMapHandler({ content: message })
      }
    },
    viewLogMessagesHandler (content) {
      this.$emit('view-log-message', content)
    },
    hexViewHandler () {
      this.$router.push(`/tools/hex/${this.active}`).catch(err => err)
    },
    trafficViewHandler () {
      this.$router.push(`/tools/traffic/${this.active}`).catch(err => err)
    },
    toTrafficHandler ({ content }) {
      const ident = content.ident,
        timeEnd = Math.floor(content.timestamp * 1000),
        timeStart = timeEnd - 10000
      if (ident) {
        this.$router.push({ path: `/tools/traffic/${this.active}/ident/${ident}`, query: { from: timeStart, to: timeEnd } }).catch(err => err)
      }
    },
    unselect () {
      this.$refs.messages.unselect()
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
    selectReset () {
      this.$refs.itemSelect && this.$refs.itemSelect.reset()
    },
    async getDeletedHandler () {
      await this.getDeleted('channels')
      this.needShowGetDeletedAction = false
      this.selectReset()
    },
    clearActive () {
      this.active = null
    },
    deletedHandler () {
      this.ratio = 100
    },
    onMapHandler ({ index, content }) {
      this.mapDevice = { ident: content.ident || '*Empty*' }
      const marker = [content['position.latitude'], content['position.longitude']]
      if (!this.isVisibleMap) {
        this.openMapHandler()
        this.$nextTick(() => {
          this.$refs.map.clear().autobounds(true).addMarkers([marker]).send()
        })
        return false
      }
      if (this.$refs.map && this.isVisibleMap) {
        this.$refs.map.clear().addMarkers([marker]).centerMap(marker).send()
      }
    },
    init () {
      const entity = 'channels',
        activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined),
        idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      this.isInit = true
      if (idFromRoute) {
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
    mapMinimizeHandler (options) {
      this.mapMinimizedOptions = options
      if (options.type === 'bottom') {
        this.siblingHeight = this.size[1]
      } else if (options.type === 'top') {
        this.siblingHeight = this.size[0]
      } else { this.siblingHeight = 0 }
    },
    mapCloseHandler () {
      this.isVisibleMap = false
      this.mapDevice = null
    },
    openMapHandler () {
      this.isVisibleMap = !this.isVisibleMap
    },
    onResize () {
      this.$refs.map && this.$refs.map.onWindowResize({ width: window.innerWidth, height: window.innerHeight })
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
        const id = Number(route.params.id)
        if (this.itemsCollection[id]) {
          this.active = Number(route.params.id)
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      const currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'channels' }, value: currentItem.id })
        this.$router.push(`/channels/${val}`).catch(err => err)
      } else {
        this.$router.push('/channels').catch(err => err)
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      } else {
        this.ratio = currentItem.deleted ? 100 : 50
      }
    }
  },
  components: { logs, messages, EntitiesToolbar, MapFrame }
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
