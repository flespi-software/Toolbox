<template>
  <q-page>
    <q-resize-observer @resize="onResizePage" />
    <entities-toolbar
      :item="selectedItem" :ratio="ratio" :actions="actions" @change-ratio="updateRatio"
    >
      <div class="flex" :class="{'middle-modificator': !active}" slot="selects">
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          filled
          :loading="isItemsInitStart && !isItemsInit"
          :hide-dropdown-icon="!isNeedSelect || (typeof isNeedSelect === 'string' && isNeedSelect.indexOf('devices') > -1)"
          :label="active ? 'Device' : 'SELECT DEVICE'"
          dark hide-bottom-space dense color="white"
          :disable="!isNeedSelect || (typeof isNeedSelect === 'string' && isNeedSelect.indexOf('devices') > -1)"
          popup-content-class="items__popup"
          :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + (needShowGetDeletedAction && tokenType === 1 ? 77 : 48) + (filteredItems.length ? 0 : 4)}px`}"
          @filter="(filter, update) => filterItems(entityName, filter, update)"
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
              @click="updateActive(scope.opt.id)"
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
          <q-btn title="Traffic hex payload" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" v-if="needTrafficRoute" @click="trafficViewHandler" flat dense style="width: 50px;">
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
        :entity-name="entityName"
        :isEnabled="!!+size[0]"
        v-if="+size[0]"
        :style="[{height: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, panelsWidgetsStyle]"
        @view-log-message="viewWidgetsLogHandler"
        @action-select="data => widgetsViewedLog = data.content"
        @to-traffic="toTrafficHandler"
        @to-error-traffic="toErrorTrafficHandler"
        :config="logsConfig"
      />
      <messages
        ref="messages"
        @action-view-data="data => { messageWidgetsActions('object', data), addWidgetTrackMarker('track', data) }"
        @action-map="data => messageWidgetsActions('position', data)"
        @action-show="data => messageWidgetsActions('show', data)"
        @action-image="data => messageWidgetsActions('image', data)"
        @action-select="data => messageWidgetsActions('select', data)"
        @action-traffic="data => messageWidgetsActions('traffic', data)"
        :item="selectedItem"
        :activeId="active"
        :isEnabled="!!+size[1]"
        :limit="limit"
        v-if="+size[1]"
        :style="[{height: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}, panelsWidgetsStyle]"
        :config="messagesConfig"
      />
    </div>
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Devices not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
    <widgets
      ref="messagesView"
      :active="activeWidgetWindow === 'messagesView'"
      v-model="isWidgetsMessageActive"
      :config="messageWidgetsViewConfig"
      :actions="widgetsHandleActions"
      :controls="widgetWindowControls"
      :view-model="widgetsViewModel.data"
      @change-view-model="data => widgetsChangeViewModelHandler(entityName, 'data', data)"
      @active="activateWidgetWindow('messagesView')"
      @close="closeMessageWidgetsHandler"
      @next="nextWidgetsMessage"
      @prev="prevWidgetsMessage"
    />
    <widgets
      ref="logsView"
      :active="activeWidgetWindow === 'logsView'"
      v-model="isWidgetsLogsActive"
      :config="logsWidgetsViewConfig"
      :actions="widgetsHandleActions"
      :controls="widgetWindowControls"
      :view-model="widgetsViewModel.data"
      @change-view-model="data => widgetsChangeViewModelHandler(entityName, 'data', data)"
      @active="activateWidgetWindow('logsView')"
      @close="closeLogsWidgetsHandler"
      @next="nextWidgetLog"
      @prev="prevWidgetLog"
    />
    <widgets
      ref="track"
      :active="activeWidgetWindow === 'track'"
      v-model="isWidgetsTrackActive"
      :config="trackWidgetConfig"
      :controls="widgetWindowControls"
      :view-model="widgetsViewModel.track"
      @change-view-model="data => widgetsChangeViewModelHandler(entityName, 'track', data)"
      @active="activateWidgetWindow('track')"
      @close="closeWidgetsHandler"
    />
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import messages from '../../components/messages/devices/Index.vue'
import MainWidgetsMixin from '../../components/widgets/MainWidgetsMixin'
import LogsWidgetsMixin from '../../components/widgets/LogsWidgetsMixin'
import MessageWidgetsMixin from '../../components/widgets/MessageWidgetsMixin'
import TrackWidgetMixin from '../../components/widgets/TrackWidgetMixin'
import Widgets from '../../components/widgets/Widgets'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import { openURL } from 'quasar'
import { mapState, mapActions } from 'vuex'
import init from '../../mixins/entitiesInit'
import routerProcess from '../../mixins/routerProcess'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import { ACTION_MODE_SINGLE } from '../../config'
import TrafficErrorDialog from '../../components/trafficViewer/TrafficErrorDialog.vue'

const ratioNames = {
  100: 'logs',
  50: 'both',
  0: 'messages'
}
const ratioValues = {
  logs: 100,
  both: 50,
  messages: 0
}

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [init, MainWidgetsMixin, LogsWidgetsMixin, MessageWidgetsMixin, TrackWidgetMixin, routerProcess],
  data () {
    return {
      entityName: 'devices',
      filter: '',
      active: null,
      isInit: false,
      isItemsInit: false,
      isItemsInitStart: false,
      needShowGetDeletedAction: true
    }
  },
  computed: {
    ...mapState({
      hasMessages (state) {
        return this.config.messages && !!state[this.config.messages.vuexModuleName] && !!state[this.config.messages.vuexModuleName].messages.length && this.ratio !== 100
      },
      hasLogs (state) {
        return this.config.logs && !!state[this.config.logs.vuexModuleName] && state[this.config.logs.vuexModuleName].messages && !!state[this.config.logs.vuexModuleName].messages.length && this.ratio !== 0
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
        if (this.isWidgetsTrackActive) { this.setWidgetTrackView('track', track) }
        return track
      },
      needTrafficRoute (state) {
        return get(state.config, 'deviceTraffic.isDrawable', false)
      }
    }),
    items () {
      return Object.values(this.itemsCollection)
    },
    selectedItem () {
      const item = (this.itemsCollection && this.itemsCollection[this.active]) || null
      if (item) {
        item.deleted && this.deletedHandler()
      }
      return item
    },
    logsConfig () {
      const config = cloneDeep(this.config.logs)
      if (this.needTrafficRoute) {
        config.actions.push({
          icon: 'mdi-download-network-outline',
          label: 'View traffic',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'traffic'
        })
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
    messagesConfig () {
      const config = cloneDeep(this.config.messages)
      if (this.needTrafficRoute) {
        config.actions.push({
          icon: 'mdi-download-network-outline',
          label: 'View traffic',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'traffic'
        })
      }
      return config
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
          condition: this.needTrafficRoute && this.$q.platform.is.mobile
        },
        {
          label: 'Map',
          icon: 'mdi-map',
          handler: () => this.showWidgetTrack(this.trackByMessages),
          condition: !!this.trackByMessages.length
        },
        {
          label: 'TrackIt',
          icon: 'mdi-map-marker-path',
          handler: () => this.goToTrackit(),
          condition: !!this.trackByMessages.length
        },
        {
          label: 'Clear',
          icon: 'mdi-playlist-remove',
          handler: this.clearHandler,
          condition: this.hasMessages || this.hasLogs
        }
      ]
    },
    panelsWidgetsStyle () {
      const style = {}
      const enabledFlags = {
        track: this.isWidgetsTrackActive,
        data: this.isWidgetsMessageActive || this.isWidgetsLogsActive
      }
      const isTwoSide = (this.widgetStyle.left && this.widgetStyle.right) &&
        (enabledFlags.track && enabledFlags.data)
      const isLeftSide = this.widgetStyle.left && enabledFlags[this.widgetStyle.left]
      const isRightSide = this.widgetStyle.right && enabledFlags[this.widgetStyle.right]
      if (isTwoSide) {
        style.maxWidth = 'calc(100% - 600px)'
        style.left = '300px'
      } else if (isLeftSide || isRightSide) {
        style.maxWidth = 'calc(100% - 300px)'
        if (isRightSide) { style.left = '300px' }
      }
      return style
    },
    ratio () {
      return get(this.settings.viewSettings, `${this.entityName}.ratio`, 50)
    }
  },
  methods: {
    ...mapActions(['getDeleted']),
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true
      }).onOk(() => {
        this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`)
        this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
        if (this.isWidgetsLogsActive) {
          this.isWidgetsLogsActive = false
          this.closeLogsWidgetsHandler()
        } else if (this.isWidgetsMessageActive) {
          this.isWidgetsMessageActive = false
          this.closeMessageWidgetsHandler()
        }
      })
        .onCancel(() => {})
    },
    async getDeletedHandler () {
      await this.getDeleted(this.entityName)
      this.needShowGetDeletedAction = false
      this.$refs.itemSelect.reset()
    },
    clearActive () {
      this.updateActive(null)
    },
    updateActive (id) {
      this.updateRoute({name: this.entityName, params: { id }}, !this.active)
    },
    deletedHandler () {
      this.changeRatioHandler(100)
    },
    trafficViewHandler () {
      this.$router.push(`/tools/device-traffic/${this.active}`).catch(err => err)
    },
    toErrorTrafficHandler ({ content }) {
      const transportType = { tcp: 2, udp: 130 }
      let timestamp = content['server.timestamp'] || content.timestamp
      let to = timestamp + 1, from = to - 10
      let error
      if (content.error_text && content.traffic) {
        timestamp = content.traffic.timestamp
        from = timestamp
        to = content.timestamp
        error = { ...content.traffic, text: content.error_text }
      }
      this.$connector.gw.getDevicesPackets(this.active, { data: { from, to, filter: `type=${transportType[content.transport]}` } })
        .then((resp) => {
          const messages = get(resp, 'data.result', [])
          const data = messages.map((message) => message.data )
          if (data) {
            this.$q.dialog({
              component: TrafficErrorDialog,
              parent: this,
              data,
              error
            }).onOk(() => {
              this.toTrafficHandler({ content })
            }).onCancel(() => {})
          } else {
            this.$q.notify({
              message: 'Traffic is empty',
              type: 'negative'
            })
          }
        })
    },
    toTrafficHandler ({ content }) {
      const timestamp = content['server.timestamp'] || content.timestamp,
        to = timestamp + 1,
        from = to - 10,
        highlight = timestamp,
        query = {
          to, from, highlight
        }
      this.$router.push({ path: `/tools/device-traffic/${this.active}`, query }).catch(err => err)
    },
    init () {
      const entity = this.entityName,
        activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined)
      let idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      const viewMode = this.$route.query.view_mode
      let ratio = 50
      if (viewMode) {
        ratio = ratioValues[viewMode]
        this.$emit('update:settings', { type: 'ENTITY_VIEW_SETTINGS_CHANGE', opt: { entity: this.entityName }, value: { ratio } })
      }
      this.isInit = true
      let id = null
      if (idFromRoute && this.itemsCollection[idFromRoute]) {
        id = idFromRoute
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        id = activeFromLocaleStorage
      } else if (
        (idFromRoute && !this.itemsCollection[idFromRoute]) ||
        (activeFromLocaleStorage && !this.itemsCollection[activeFromLocaleStorage])
      ) {
        this.clearActive()
      }
      // deleted item logic
      if (this.selectedItem && this.selectedItem.deleted) {
        this.deletedHandler()
      }
      if (id) {
        this.active = id
        this.updateRoute({ name: this.entityName, params: { id }, query: { view_mode: ratioNames[ratio] } }, true)
      }
      this.$emit('inited')
    },
    moveToIntervals (deviceId, calcId) {
      this.$nextTick(() => {
        this.$router.push({
          name: 'intervals',
          params: { deviceId, calcId: calcId },
          query: { noselect: 'devices' }
        }).catch(err => err)
      })
    },
    clearWidgetsState () {
      this.isWidgetsMessageActive = false
      this.isWidgetsLogsActive = false
      this.isWidgetsTrackActive = false
      this.activeWidgetWindow = undefined
      this.widgetsViewedMessage = null
      this.widgetsViewedLog = null
    },
    beforeEnableWidgetByPane (entity) {
      if (!this.widgetStyle.left && !this.isWidgetsMessageActive && !this.isWidgetsLogsActive && !this.widgetsViewModel.data) {
        this.$nextTick(() => this.widgetsChangeViewModelHandler(this.entityName, 'data', { type: 'minimized', to: 'left' }))
      }
      switch (entity) {
        case 'messages': {
          this.isWidgetsLogsActive = false
          this.closeLogsWidgetsHandler()
          break
        }
        case 'logs': {
          this.isWidgetsMessageActive = false
          this.closeMessageWidgetsHandler()
          break
        }
      }
    },
    onResizePage (size) {
      this.$refs.track.resize(size)
      this.$refs.messagesView.resize(size)
      this.$refs.logsView.resize(size)
    },
    updateRatio (r) {
      this.updateRoute({
        query: { view_mode: ratioNames[r] }
      })
    },
    changeRatioHandler (r) {
      this.ratioWidgetsModify(r)
      this.$emit('update:settings', { type: 'ENTITY_VIEW_SETTINGS_CHANGE', opt: { entity: this.entityName }, value: { ratio: r } })
      this.$nextTick(() => {
        if (+this.size[0] && this.active) {
          this.$refs.logs.resetParams()
        }
        if (+this.size[1] && this.active) {
          this.$refs.messages.resetParams()
        }
      })
    },
    goToTrackit () {
      const state = this.config && this.config.messages && this.$store.state[this.config.messages.vuexModuleName]
      const from = Math.floor(state.from / 1000)
      const to = Math.floor(state.to / 1000)
      openURL(`${this.$flespiServer}/trackit/#/login/${this.$store.state.token}/devices/${this.active}?from=${from}&to=${to}`)
    }
  },
  watch: {
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
      this.clearWidgetsState()
      this.processRoute({ view_mode: (name) => this.changeRatioHandler(ratioValues[name]) }, route)
    },
    active (val, old) {
      const currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: this.entityName }, value: currentItem.id })
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      }
    }
  },
  components: { logs, messages, Widgets, EntitiesToolbar }
}
</script>
<style lang="stylus" scoped>
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
