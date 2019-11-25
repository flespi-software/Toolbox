<template>
  <q-page>
    <q-toolbar class="justify-between bg-grey-9">
      <div :class="{'middle-modificator': !active}" v-if="items.length" style="max-width: 50%">
        <!-- <q-item class="no-padding" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
          <q-item-section>
            <q-item-label header class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{active ? selectedItem.name || `#${selectedItem.id}` : 'SELECT DEVICE'}}</q-item-label>
            <q-item-label caption class="ellipsis overflow-hidden" style="font-size: 0.8rem" v-if="active && selectedItem.configuration && selectedItem.configuration.ident">{{selectedItem.configuration.ident}}</q-item-label>
          </q-item-section>
          <q-item-section class="text-right">
            <q-item-label style="display: inline-block" stamp color="white" class="text-center" v-if="active"><div v-if="selectedItem.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedItem.id}}</q-item-label>
            <q-item-label v-if="isNeedSelect" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-section>
          <q-menu fit ref="popoverActive" v-if="isNeedSelect" :anchor="active ? undefined : 'bottom middle'" :self="active ? undefined : 'top middle'">
            <q-input :value="filter" @input="f => filter = f || ''" color="grey-9" clearable placeholder="Filter" class="q-ma-xs q-pa-xs items__filter"/>
            <q-list separator class="scroll">
              <VirtualList
                v-if="filteredItems.length"
                :size="56"
                :remain="filteredItems.length > 6 ? 6 : filteredItems.length"
              >
                <q-item
                  v-for="(item, index) in filteredItems"
                  :key="index"
                  v-close-popup
                  @click.native="active = item.id, $emit('view-data-hide')"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  clickable
                >
                  <q-item-section>
                    <q-item-label header class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || `#${item.id}`}}</q-item-label>
                    <q-item-label class="ellipsis overflow-hidden" caption><small>{{item.configuration && item.configuration.ident ? item.configuration.ident : `&lt;no ident&gt;`}}</small></q-item-label>
                  </q-item-section>
                  <q-item-section class="text-center">
                    <q-item-label v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-label>
                    <q-item-label><small>#{{item.id}}</small></q-item-label>
                  </q-item-section>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No devices
              </div>
            </q-list>
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">see deleted</q-btn>
          </q-menu>
        </q-item> -->
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          filled
          :label="active ? 'Device' : 'SELECT DEVICE'"
          dark hide-bottom-space dense color="white"
          :disable="!isNeedSelect"
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
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler">see deleted</q-btn>
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
              @click="active = scope.opt.id, $emit('view-data-hide')"
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
                <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{scope.opt.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div v-if="active">
        <q-btn v-if="!selectedItem.deleted" flat dense class="on-right pull-right text-center rounded-borders q-px-xs q-py-none" color="white" @click="modeModel = !modeModel" style="min-width: 70px; max-width: 70px;">
          <q-icon size="1.5rem" color="white" :name="modeModel ? 'playlist_play' : 'history'"/>
          <div style="font-size: .7rem; line-height: .7rem">{{modeModel ? 'Real-time' : 'History'}}</div>
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
        </q-btn>
        <q-btn-toggle
          v-if="!selectedItem.deleted"
          dense
          color="grey-8"
          toggle-color="white"
          toggle-text-color="grey-9"
          class="q-ml-sm gt-xs" size="sm"
          v-model="ratio"
          :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
        />
        <q-btn class="lt-sm" dense size="sm">
          {{ratio === 50 ? 'both' : (ratio === 0 ? 'messages' : 'logs')}}
          <q-menu style="background-color: transparent">
            <q-btn-toggle
              v-close-popup
              v-if="!selectedItem.deleted"
              dense
              color="grey-8"
              toggle-color="white"
              toggle-text-color="grey-9"
              size="sm"
              v-model="ratio"
              :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
            />
          </q-menu>
        </q-btn>
      </div>
      <div v-if="active && $q.platform.is.desktop" class="flex justify-end" style="width: 206px;">
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="Intervals" class="on-left cursor-pointer pull-right text-center rounded-borders q-px-xs q-py-none text-white" @click="moveToIntervals(active, null)" v-if="tasksByDevice.length" flat dense style="width: 60px">
            <q-icon size="1.5rem" name="mdi-set-center"/>
            <div style="font-size: .7rem; line-height: .7rem">Intervals</div>
          </q-btn>
        </transition>
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="Map" v-if="messagesWithPosition.length" class="on-left cursor-pointer pull-right text-center rounded-borders q-px-xs q-py-none text-white" @click="isVisibleMap = !isVisibleMap" flat dense style="width: 50px">
            <q-icon size="1.5rem" name="mdi-map"/>
            <div style="font-size: .7rem; line-height: .7rem">Map</div>
          </q-btn>
        </transition>
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="Clear all panes" class="on-left pull-right text-center q-py-none text-white" v-if="modeModel && !isEmptyMessages" @click="clearHandler" flat dense style="width: 60px">
            <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
            <div style="font-size: .7rem; line-height: .7rem">Clear</div>
          </q-btn>
        </transition>
      </div>
      <div v-else-if="active && !$q.platform.is.desktop">
        <q-btn flat icon="mdi-dots-vertical" color="white">
          <q-menu>
            <q-list>
              <q-item v-close-popup v-if="tasksByDevice.length" @click.native="moveToIntervals(active, null)">
                <q-item-section avatar>
                  <q-icon name="mdi-set-center" />
                </q-item-section>
                <q-item-section>Intervals</q-item-section>
              </q-item>
              <q-item v-close-popup @click="clearHandler" clickable>
                <q-item-section avatar>
                  <q-icon name="mdi-playlist-remove" />
                </q-item-section>
                <q-item-section>Clear</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
    <div v-if="isInit && active">
      <logs
        ref="logs"
        :mode="mode"
        :item="selectedItem"
        :limit="limit"
        originPattern="gw/devices/:id"
        :isEnabled="!!+size[0]"
        v-if="+size[0]"
        :style="[{minHeight: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, {maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'logs' ? '66%' : ''}]"
        @view-log-message="viewLogMessagesHandler"
        :config="config.logs"
      />
      <messages
        ref="messages"
        @view-data="viewDataHandler"
        :mode="mode"
        :item="selectedItem"
        :activeId="active"
        :isEnabled="!!+size[1]"
        :limit="limit"
        v-if="+size[1]"
        :style="[{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, {maxWidth: mapMinimizedOptions.value && mapMinimizedOptions.type && mapMinimizedOptions.type === 'messages' ? '66%' : ''}]"
        :config="config.messages"
      />
    </div>
    <div v-if="!items.length" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Devices not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
    <map-component
      ref="map"
      v-if="active && messagesWithPosition.length && $q.platform.is.desktop && isVisibleMap"
      :messages="messagesWithPosition"
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
import MapComponent from '../../components/MapComponent'
import { mapState, mapActions } from 'vuex'
// import VirtualList from 'vue-virtual-scroll-list'
import init from '../../mixins/entitiesInit'

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
  mixins: [init],
  data () {
    return {
      filter: '',
      mode: 1,
      active: null,
      ratio: 50,
      isInit: false,
      isVisibleMap: false,
      mapMinimizedOptions: {},
      siblingHeight: null,
      needShowGetDeletedAction: true
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        let hasntMessages = this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length && this.ratio !== 100,
          hasntLogs = this.config.logs && state[this.config.logs.vuexModuleName] && state[this.config.logs.vuexModuleName].messages && !state[this.config.logs.vuexModuleName].messages.length && this.ratio !== 0
        return hasntMessages && hasntLogs
      },
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      itemsCollection (state) {
        return state.items
      },
      items (state) {
        return Object.values(state.items)
      },
      selectedItem (state) {
        let item = state.items[this.active] || null
        if (item && item.deleted) {
          this.deletedHandler()
        }
        return item
      },
      tasksByDevice (state) {
        return Object.values(state['addition.tasks'] || {})
      }
    }),
    filteredItems () {
      let filter = this.filter.toLowerCase()
      let filteredItems = this.filter ? this.items.filter(item => {
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
        let lName = l.name.toLowerCase()
        let rName = r.name.toLowerCase()
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
    messagesWithPosition () {
      return this.config && this.config.messages && this.$store.state[this.config.messages.vuexModuleName]
        ? this.$store.state[this.config.messages.vuexModuleName].messages.filter(message => !!message['position.latitude'] && !!message['position.longitude'])
        : []
    },
    modeModel: {
      get () {
        return !!this.mode
      },
      set (val) {
        let now = Date.now()
        this.date = val ? 0 : now - (now % 86400000)
        this.mode = Number(val)
        this.$emit('view-data-hide')
      }
    }
  },
  methods: {
    ...mapActions(['getDeleted']),
    filterItems (filter, update) {
      update()
    },
    viewDataHandler (content) {
      this.$emit('view-data', content)
      if (this.isVisibleMap && content['position.latitude'] && content['position.longitude']) {
        this.$refs.map.flyTo([content['position.latitude'], content['position.longitude']])
      }
    },
    viewLogMessagesHandler (content) {
      this.$emit('view-log-message', content)
    },
    unselect () {
      this.$refs.messages.unselect()
    },
    showMap () {
      if (this.messagesWithPosition.length) {
        this.isVisibleMap = !this.isVisibleMap
      }
    },
    mapMinimizeHandler (options) {
      this.mapMinimizedOptions = options
      if (options.type === 'messages') {
        this.siblingHeight = this.size[1]
      } else if (options.type === 'logs') {
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
      this.mode = 0
    },
    init () {
      let entity = 'devices',
        activeFromLocaleStorage = this.$q.localStorage.getItem(entity),
        idFromRoute = this.$route.params && this.$route.params.id ? this.$route.params.id : null,
        calcId
      this.isInit = true
      if (idFromRoute) {
        idFromRoute = idFromRoute.split('-')
        if (idFromRoute.length > 1) {
          calcId = Number(idFromRoute[1])
          idFromRoute = Number(idFromRoute[0])
        }
        if (calcId) {
          this.moveToIntervals(idFromRoute, calcId)
          return false
        }
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
    },
    moveToIntervals (deviceId, calcId) {
      this.$nextTick(() => { this.$router.push(`/devices/${deviceId}/calc/${calcId}/intervals`).catch(err => err) })
    }
  },
  watch: {
    ratio (val) {
      this.$nextTick(() => {
        if (+this.size[0] && this.active) {
          this.$refs.logs.resetParams()
          this.$emit('view-data-hide')
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
      let currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$q.localStorage.set('devices', val)
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
  components: { logs, messages, MapComponent }
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
  .deleted-action
    width 100%
    color #eee
    background-color #999
    font-size .7rem
    padding-top 0
    padding-bottom 0
</style>
