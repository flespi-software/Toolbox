<template>
  <q-page>
    <q-toolbar color="dark" class="justify-between q-py-none">
      <div style="max-width: 55%;">
        <q-item class="no-padding q-mr-sm" style="display: inline-flex; max-width: calc(50% - 8px);" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
          <q-item-side style="min-width: 25px;" v-if="$q.platform.is.desktop">
            <q-item-tile><q-icon color="white" name="mdi-calculator-variant" size="25px"/></q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}" v-if="active">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-tile>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}" v-else>Select calc</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right">
            <q-item-tile style="display: inline-block" stamp color="white" class="text-center"  v-if="selectedItem.id"><div v-if="selectedItem.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedItem.id.toString()}}</q-item-tile>
            <q-item-tile v-if="isNeedSelect" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-side>
          <q-popover fit ref="popoverActive" v-if="isNeedSelect">
            <q-input v-model="filter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredItems.length"
                :size="40"
                :remain="filteredItems.length + 1 > 6 ? 6 : filteredItems.length + 1"
              >
                <q-item
                  @click.native="active = null, $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer text-grey"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden">Select calc...</q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-right">
                    <q-icon name="mdi-close"/>
                  </q-item-side>
                </q-item>
                <q-item
                  v-for="(item, index) in filteredItems"
                  :key="index"
                  @click.native="active = item.id, $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden">{{item.name || '&lt;noname&gt;'}}</q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile v-if="item.id"><small>#{{item.id.toString()}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No calcs
              </div>
            </q-list>
          </q-popover>
        </q-item>
        <!-- device selector -->
        <q-item class="no-padding" style="display: inline-flex; max-width: 50%" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
          <q-item-side style="min-width: 25px;" v-if="$q.platform.is.desktop">
            <q-item-tile><q-icon color="white" name="mdi-developer-board" size="25px"/></q-item-tile>
          </q-item-side>
          <q-item-main>
            <template v-if="activeDeviceId">
              <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedDevice.name || `#${selectedDevice.id}`}}</q-item-tile>
              <q-item-tile sublabel style="font-size: 0.8rem" v-if="selectedDevice.ident">{{selectedDevice.ident}}</q-item-tile>
            </template>
            <q-item-tile v-else label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">Select device</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right">
            <q-item-tile style="display: inline-block" stamp color="white" class="text-center"><div v-if="selectedDevice.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedDevice.id}}</q-item-tile>
            <q-item-tile v-if="isNeedSelect" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-side>
          <q-popover fit ref="popoverActive" v-if="isNeedSelect">
            <q-input v-model="deviceFilter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredDevices.length"
                :size="55"
                :remain="filteredDevices.length + 1 > 6 ? 6 : filteredDevices.length + 1"
              >
                <q-item
                  @click.native="activeDeviceId = null, $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer text-grey"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}" style="line-height: 39px;">Select device...</q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-right">
                    <q-icon name="mdi-close"/>
                  </q-item-side>
                </q-item>
                <q-item
                  v-for="(item, index) in filteredDevices"
                  :key="index"
                  @click.native="activeDeviceId = item.id, $refs.popoverActive.hide(), $emit('view-data-hide')"
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
        <!-- device selector -->
      </div>
      <div>
        <q-btn title="Mode (Real-time/History)" size="sm" v-if="!selectedItem.deleted" flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'" :rounded="$q.platform.is.mobile">
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
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
          :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'intervals', value: 0}]"
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
              :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'intervals', value: 0}]"
            />
          </q-popover>
        </q-btn>
      </div>
      <div>
        <q-icon title="Clear all panes" size="1.5rem" class="on-left cursor-pointer pull-right" v-if="modeModel && !isEmptyMessages" color="white" name="mdi-playlist-remove" @click.native="clearHandler" />
      </div>
    </q-toolbar>
    <logs
      ref="logs"
      :mode="mode"
      :item="selectedItem"
      :limit="limit"
      :isEnabled="!!+size[0]"
      originPattern="gw/calcs/:id"
      :config="config.logs"
      v-if="+size[0] && active"
      :style="{minHeight: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
      @view-log-message="viewLogMessagesHandler"
    />
    <div v-else-if="+size[0] && !active" class="text-grey text-center q-mt-lg" style="font-size: 2.5rem;" :style="{minHeight: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}">
      Select a calc
    </div>
    <messages
      ref="messages"
      @view-data="viewDataHandler"
      :mode="mode"
      :activeId="active"
      :item="selectedItem"
      :activeDeviceId="activeDeviceId"
      :isEnabled="!!+size[1]"
      :limit="0"
      :config="config.messages"
      v-if="+size[1] && active && activeDeviceId"
      :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
    />
    <div v-else-if="+size[1] && active && !activeDeviceId" class="text-grey text-center q-mt-lg" style="font-size: 2.5rem;" :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}">
      Select device
    </div>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import messages from '../../components/intervals/Index.vue'
import { mapState } from 'vuex'
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
      deviceFilter: '',
      mode: 1,
      active: null,
      activeDeviceId: null,
      ratio: 50,
      isInit: false
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
      },
      devices (state) {
        let devices = state['addition.devices'] || [],
          ids = devices.map(item => item.id)
        if (this.isInit && this.activeDeviceId && !ids.includes(this.activeDeviceId)) {
          this.clearActiveDevice()
        }
        return devices
      },
      tasks (state) {
        return state['addition.tasks'] || []
      }
    }),
    filteredItems () {
      let items = this.items
      if (this.activeDeviceId) {
        items = items.filter(item => this.tasks.some(task => this.activeDeviceId === task.device_id && item.id === task.calc_id))
      }
      return this.filterItems(items, this.filter.toLowerCase())
    },
    filteredDevices () {
      let devices = this.devices
      if (this.active) {
        devices = devices.filter(item => this.tasks.some(task => this.active === task.calc_id && item.id === task.device_id))
      }
      return this.filterItems(devices, this.deviceFilter.toLowerCase())
    },
    size () {
      return [this.ratio, 100 - this.ratio]
    },
    selectedItem () {
      let item = this.items.filter(item => item.id === this.active)[0] || {}
      return item
    },
    selectedDevice () {
      return this.devices.filter(item => item.id === this.activeDeviceId)[0] || {}
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
    filterItems (items, filter) {
      let filteredItems = this.filter ? items.filter(item => {
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
      }) : items
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
    viewDataHandler (content) {
      this.$emit('view-data', content)
    },
    viewLogMessagesHandler (content) {
      this.$emit('view-log-message', content)
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
      }).then(() => {
        this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`)
        this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
      })
        .catch(() => {})
    },
    clearActive () {
      this.active = null
    },
    clearActiveDevice () {
      this.activeDeviceId = null
    },
    init () {
      let entity = 'calcs',
        activeFromLocaleStorage = this.$q.localStorage.get.item(entity),
        activeDeviceIdFromLS = this.$q.localStorage.get.item('calcsDeviceId'),
        idFromRoute = this.$route.params && this.$route.params.id ? this.$route.params.id : null,
        deviceIdFromRoute = this.$route.params && this.$route.params.deviceId ? this.$route.params.deviceId : null
      this.isInit = true
      if (idFromRoute) {
        /* '-' is delimeter for id`s combination */
        idFromRoute = idFromRoute.split('-')
        let goByCombination = idFromRoute.length === 2
        deviceIdFromRoute = deviceIdFromRoute || idFromRoute[1]
        idFromRoute = idFromRoute[0]
        if (this.items.filter(item => item.id === Number(idFromRoute)).length) {
          this.active = Number(idFromRoute)
          if (deviceIdFromRoute && this.devices.filter(item => item.id === Number(deviceIdFromRoute)).length) {
            this.activeDeviceId = Number(deviceIdFromRoute)
            if (goByCombination) { this.$router.push(`/calcs/${idFromRoute}/device/${deviceIdFromRoute}`) }
          }
        } else {
          this.active = null
        }
      } else if (activeFromLocaleStorage && this.items.filter(item => item.id === activeFromLocaleStorage).length) {
        this.active = activeFromLocaleStorage
        if (activeDeviceIdFromLS && this.devices.filter(item => item.id === activeDeviceIdFromLS).length) {
          this.activeDeviceId = Number(activeDeviceIdFromLS)
        }
      }
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
      if (
        route.params && route.params.id && Number(route.params.id) === this.active &&
        route.params.deviceId && this.activeDeviceId === Number(route.params.deviceId)
      ) { return false }
      if (route.params && route.params.id) {
        if (this.items.filter(item => item.id === Number(route.params.id)).length) {
          this.active = Number(route.params.id)
          if (route.params.deviceId) {
            this.activeDeviceId = Number(route.params.deviceId)
          }
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (id) {
      if (id && this.activeDeviceId) {
        this.$q.localStorage.set('calcs', id)
        this.$router.push(`/calcs/${id}/device/${this.activeDeviceId}`)
      } else if (id && !this.activeDeviceId) {
        this.$q.localStorage.set('calcs', id)
        this.$router.push(`/calcs/${id}`)
      } else {
        this.$router.push('/calcs')
      }
    },
    activeDeviceId (deviceId) {
      if (deviceId && this.active) {
        this.$q.localStorage.set('calcsDeviceId', deviceId)
        this.$router.push(`/calcs/${this.active}/device/${deviceId}`)
      } else if (!deviceId && this.active) {
        this.$router.push(`/calcs/${this.active}`)
      } else {
        this.$router.push('/calcs')
      }
    }
  },
  components: { logs, messages, VirtualList }
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
