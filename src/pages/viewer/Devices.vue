<template>
  <q-page>
    <div class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem" v-if="!active">
      <div class="text-grey-3" style="margin-top: 50px">
        <q-btn flat style="display: flex; flex-wrap: nowrap; margin-top: 20px" icon-right="mdi-menu-down" v-if="items.length">
          Select device
          <q-popover fit ref="popoverNotActive">
            <q-input v-model="filter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredItems"
                :size="56"
                :remain="filteredItems.length > 6 ? 6 : filteredItems.length"
              >
                <q-item
                  v-for="(item, index) in filteredItems"
                  :key="index"
                  @click.native="active = item.id, $refs.popoverNotActive.hide()"
                  highlight
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                >
                  <q-item-main>
                    <q-item-tile :title="item.name" label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || `#${item.id}`}}</q-item-tile>
                    <q-item-tile sublabel><small>{{item.ident || `&lt;no ident&gt;`}}</small></q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile><small>#{{item.id}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No devices
              </div>
            </q-list>
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">see deleted</q-btn>
          </q-popover>
        </q-btn>
        <div v-if="!items.length">
          <div>{{isLoading ? 'Fetching data..' : 'Devices not found'}}</div>
          <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
        </div>
      </div>
    </div>
    <template v-else>
      <q-toolbar color="dark" class="justify-between">
        <q-item class="no-padding" style="max-width: 50%" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
          <q-item-main>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedItem.name || `#${selectedItem.id}`}}</q-item-tile>
            <q-item-tile sublabel style="font-size: 0.8rem" v-if="selectedItem.ident">{{selectedItem.ident}}</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right">
            <q-item-tile style="display: inline-block" stamp color="white" class="text-center"><div v-if="selectedItem.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedItem.id}}</q-item-tile>
            <q-item-tile v-if="isNeedSelect" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-side>
          <q-popover fit ref="popoverActive" v-if="isNeedSelect">
            <q-input v-model="filter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredItems.length"
                :size="56"
                :remain="filteredItems.length > 6 ? 6 : filteredItems.length"
              >
                <q-item
                  v-for="(item, index) in filteredItems"
                  :key="index"
                  @click.native="active = item.id, $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || `#${item.id}`}}</q-item-tile>
                    <q-item-tile sublabel><small>{{item.ident || `&lt;no ident&gt;`}}</small></q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile><small>#{{item.id}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No devices
              </div>
            </q-list>
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">see deleted</q-btn>
          </q-popover>
        </q-item>
        <div>
          <q-btn title="Mode (Real-time/History)" size="sm" v-if="!selectedItem.deleted" flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
            <span class="gt-xs">{{modeModel ? 'Real-time' : 'History'}}</span>
            <q-chip small square color="red" v-if="newMessagesCount" class="cursor-pointer q-ml-sm">{{newMessagesCount}}</q-chip>
          </q-btn>
          <q-btn-toggle
            v-if="!selectedItem.deleted"
            dense
            color="grey-8"
            toggle-color="white"
            toggle-text-color="dark"
            class="q-ml-sm gt-xs" size="sm"
            v-model="ratio"
            :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
          />
          <q-btn class="lt-sm" dense size="sm">
            {{ratio === 50 ? 'both' : (ratio === 0 ? 'messages' : 'logs')}}
            <q-popover style="background-color: transparent">
              <q-btn-toggle
                v-close-overlay
                v-if="!selectedItem.deleted"
                dense
                color="grey-8"
                toggle-color="white"
                toggle-text-color="dark"
                size="sm"
                v-model="ratio"
                :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
              />
            </q-popover>
          </q-btn>
        </div>
        <div>
          <q-icon title="Map" v-if="messagesWithPosition.length && $q.platform.is.desktop" size="1.5rem" class="on-left cursor-pointer pull-right" name="mdi-map" @click.native="isVisibleMap = !isVisibleMap"/>
          <q-icon title="Clear all panes" size="1.5rem" class="on-left cursor-pointer pull-right" v-if="modeModel && !isEmptyMessages" color="white" name="mdi-playlist-remove" @click.native="clearHandler"/>
        </div>
      </q-toolbar>
      <div>
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
      <map-component
        ref="map"
        v-if="active && messagesWithPosition.length && $q.platform.is.desktop && isVisibleMap"
        :messages="messagesWithPosition"
        :device="selectedItem"
        :siblingHeight="siblingHeight"
        @map:close="isVisibleMap = false"
        @map:minimize="mapMinimizeHandler"
      />
    </template>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import messages from '../../components/messages/devices/Index.vue'
import MapComponent from '../../components/MapComponent'
import { mapState, mapActions } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
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
      newMessagesCount (state) {
        let messagesCount = this.config.messages && state[this.config.messages.vuexModuleName] ? state[this.config.messages.vuexModuleName].newMessagesCount : 0,
          logsCount = this.config.logs && state[this.config.logs.vuexModuleName] ? state[this.config.logs.vuexModuleName].newMessagesCount : 0
        return messagesCount + logsCount
      },
      isEmptyMessages (state) {
        let hasntMessages = this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length && this.ratio !== 100,
          hasntLogs = this.config.logs && state[this.config.logs.vuexModuleName] && state[this.config.logs.vuexModuleName].messages && !state[this.config.logs.vuexModuleName].messages.length && this.ratio !== 0
        return hasntMessages && hasntLogs
      },
      tokenType (state) { return state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      items (state) {
        let items = state.items,
          ids = items.map(item => item.id)
        if (this.isInit && this.acitve && !ids.includes(this.acitve)) {
          this.clearActive()
        }
        return items
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
          item &&
          typeof item.ident !== 'undefined' &&
          item.ident !== null &&
          item.ident.toLowerCase().indexOf(filter) >= 0
        )
      }) : this.items
      filteredItems.sort((l, r) => {
        let lName = l.name.toLowerCase()
        let rName = r.name.toLowerCase()
        if (!lName || lName < rName) {
          return -1
        } else if (!rName || lName > rName) {
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
    selectedItem () {
      let item = this.items.filter(item => item.id === this.active)[0] || {}
      if (item.deleted) {
        this.deletedHandler()
      }
      return item
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
      }).then(() => {
        this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`)
        this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
      })
        .catch(() => {})
    },
    async getDeletedHandler () {
      await this.getDeleted('devices')
      this.needShowGetDeletedAction = false
    },
    clearActive () {
      this.active = null
    },
    deletedHandler () {
      this.ratio = 100
      this.mode = 0
    }
  },
  created () {
    let entity = 'devices',
      activeFromLocaleStorage = this.$q.localStorage.get.item(entity),
      idFromRoute = this.$route.params && this.$route.params.id ? this.$route.params.id : null

    this.$store.dispatch('getItems', this.isNeedSelect ? entity : {entity, id: idFromRoute})
      .then(() => {
        this.isInit = true
        if (idFromRoute) {
          if (this.items.filter(item => item.id === Number(idFromRoute)).length) {
            this.active = Number(idFromRoute)
          } else {
            this.active = null
          }
        } else if (activeFromLocaleStorage && this.items.filter(item => item.id === activeFromLocaleStorage).length) {
          this.active = activeFromLocaleStorage
        }
        // deleted item logic
        if (this.selectedItem.deleted) {
          this.deletedHandler()
        }
      })
  },
  destroyed () {
    let idFromRoute = this.$route.params && this.$route.params.id ? this.$route.params.id : null,
      entity = 'devices'
    this.$store.dispatch('unsubscribeItems', this.isNeedSelect ? entity : {entity, id: idFromRoute})
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
        if (this.items.filter(item => item.id === Number(route.params.id)).length) {
          this.active = Number(route.params.id)
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      let currentItem = this.items.filter(item => item.id === val)[0] || {}
      if (val) {
        this.$q.localStorage.set('devices', val)
        this.$router.push(`/devices/${val}`)
      } else {
        this.$router.push('/devices')
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      } else {
        this.ratio = currentItem.deleted ? 100 : 50
      }
    }
  },
  components: { logs, messages, MapComponent, VirtualList }
}
</script>
<style lang="stylus">
  @import '~variables'
  .items__filter {
    min-width: 250px;
    border: 1px solid $dark;
    border-radius: 3px;
  }
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
  .cheap-modifier {
    font-size: .7rem;
    font-weight: bolder;
    border-radius: 3px;
    background-color: #90a4ae;
    color: white;
    padding: 0 3px;
    margin-bottom: 3px;
  }
  .deleted-action {
    width: 100%;
    color: #999;
    background-color: #eee;
    font-size: .7rem;
    padding-top: 0;
    padding-bottom: 0
  }
</style>
