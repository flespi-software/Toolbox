<template>
  <q-page class="intervals-page">
    <q-resize-observer @resize="onResizePage" />
    <q-toolbar class="justify-between q-py-none bg-grey-9">
      <div class="flex" style="width: 75%;">
        <!-- device selector -->
        <div :style="{maxWidth: $q.platform.is.mobile ? '48%' : '40%'}" style="display: inline-flex" class="q-mr-sm">
          <q-select
            ref="itemDeviceSelect"
            class="items__select"
            :class="{'items__select--no-selected': !active}"
            :value="active"
            :options="filteredDevices"
            filled
            :label="active ? undefined : 'SELECT DEVICE'"
            dark hide-bottom-space dense color="white"
            :disable="devicesSelectorDisabled"
            :hide-dropdown-icon="devicesSelectorDisabled"
            popup-content-class="items__popup"
            :popup-content-style="{height: `${((filteredDevices.length > 6 ? 6 : filteredDevices.length) * 48) + 48 + (filteredDevices.length ? 0 : 34)}px`}"
            @filter="filterDevicesSelectItems"
          >
            <div slot="before-options" class="bg-dark q-pa-xs select__filter">
              <q-input v-model="deviceFilter" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" autofocus @input="filter => $refs.itemDeviceSelect.filter(filter)">
                <q-icon slot="prepend" name="mdi-magnify" color="white" />
              </q-input>
            </div>
            <q-icon slot="prepend" name="mdi-developer-board" color="white" v-if="$q.platform.is.desktop"/>
            <template v-slot:no-option>
              <div style="min-height: 77px;">
                <q-input v-model="deviceFilter" @input="filter => $refs.itemDeviceSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" class="q-ma-xs" autofocus>
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
                style="margin-top: 2px; max-width: 100%; min-height: auto;"
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-none text-white">{{selectedDevice.name || '&lt;noname&gt;'}}</q-item-label>
                  <q-item-label class="q-pa-none q-mt-none text-white ellipsis" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{selectedDevice.configuration && selectedDevice.configuration.ident ? selectedDevice.configuration.ident : `&lt;no ident&gt;`}}</small></q-item-label>
                </q-item-section>
                <q-item-section class="text-white" side v-if="$q.platform.is.desktop">
                  <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedDevice.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                @click="setActive(scope.opt.id)"
                v-on="scope.itemEvents"
                :class="{'text-grey-8': scope.opt.deleted}"
                class="q-pa-xs"
                clickable
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-xs">{{scope.opt.name || '&lt;noname&gt;'}}</q-item-label>
                  <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.configuration && scope.opt.configuration.ident ? scope.opt.configuration.ident : `&lt;no ident&gt;`}}</small></q-item-label>
                </q-item-section>
                <q-item-section side v-if="$q.platform.is.desktop">
                  <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- device selector -->
        <div :style="{maxWidth: $q.platform.is.mobile ? '48%' : '40%'}" style="display: inline-flex">
          <q-select
            ref="itemCalcSelect"
            class="items__select"
            :class="{'items__select--no-selected': !activeCalcId}"
            :value="activeCalcId"
            :options="filteredCalcs"
            filled
            :disable="calcsSelectorDisabled"
            :hide-dropdown-icon="calcsSelectorDisabled"
            :label="activeCalcId ? undefined : 'SELECT CALC'"
            dark hide-bottom-space dense color="white"
            popup-content-class="items__popup"
            :popup-content-style="{height: `${((filteredCalcs.length > 6 ? 6 : filteredCalcs.length) * 48) + 48 + (filteredCalcs.length ? 0 : 34)}px`}"
            @filter="filterCalcsSelectItems"
          >
            <div slot="before-options" class="bg-dark q-pa-xs select__filter">
              <q-input v-model="calcFilter" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" @input="filter => $refs.itemCalcSelect.filter(filter)" autofocus>
                <q-icon slot="prepend" name="mdi-magnify" color="white" />
              </q-input>
            </div>
            <q-icon slot="prepend" name="mdi-calculator-variant" color="white" v-if="$q.platform.is.desktop"/>
            <template v-slot:no-option>
              <div style="min-height: 77px;">
                <q-input v-model="calcFilter" @input="filter => $refs.itemCalcSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" class="q-ma-xs" autofocus>
                  <q-icon slot="prepend" name="mdi-magnify" color="white" />
                </q-input>
                <div class="text-center">No results</div>
              </div>
            </template>
            <template v-slot:selected-item="scope">
              <q-item
                v-if="selectedCalc"
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
                class="q-pa-none"
                style="min-height: 20px; margin-top: 2px; max-width: 100%"
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-none text-white">{{selectedCalc.name || '&lt;noname&gt;'}}</q-item-label>
                </q-item-section>
                <q-item-section class="text-white" side v-if="$q.platform.is.desktop">
                  <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedCalc.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                @click="setActiveCalc(scope.opt.id)"
                v-on="scope.itemEvents"
                :class="{'text-grey-8': scope.opt.deleted}"
                class="q-pa-xs"
                clickable
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-xs">{{scope.opt.name || '&lt;noname&gt;'}}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="$q.platform.is.desktop">
                  <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div v-if="$q.platform.is.desktop" class="flex justify-end" :style="{width: `${actions.length * 72}px`}">
        <template v-for="(action, index) in actions">
          <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp" :key="index" v-if="action.condition">
            <q-btn :title="action.label" class="on-left cursor-pointer pull-right text-center rounded-borders q-px-xs q-py-none text-white" @click="action.handler" flat dense style="max-width: 60px">
              <q-icon size="1.5rem" :name="action.icon"/>
              <div style="font-size: .7rem; line-height: .7rem">{{action.label}}</div>
              <q-tooltip v-if="action.desc">{{action.desc}}</q-tooltip>
            </q-btn>
          </transition>
        </template>
      </div>
      <div v-else>
        <q-btn flat icon="mdi-dots-vertical" color="white" v-if="hasActiveActions">
          <q-menu no-route-dismiss>
            <q-list>
              <template v-for="(action, index) in actions">
                <q-item v-close-popup v-if="action.condition" clickable @click="action.handler" :key="index">
                  <q-item-section avatar>
                    <q-icon :name="action.icon" />
                  </q-item-section>
                  <q-item-section>{{action.label}}</q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
    <div>
      <intervals
        ref="intervals"
        @action-view-data="data => intervalWidgetsActions('object', { ...data, refName: 'intervals' })"
        @action-map="data => intervalWidgetsActions('track', { ...data, refName: 'intervals' })"
        @action-show="data => intervalWidgetsActions('show', { ...data, refName: 'intervals' })"
        @action-select="data => intervalWidgetsActions('select', { ...data, refName: 'intervals' })"
        @in-messages="(interval) => viewedInterval = interval"
        @change:date-range="dateRangeChange"
        :activeId="activeCalcId"
        :item="selectedCalc"
        :activeDeviceId="active"
        :limit="0"
        :config="config.intervals"
        v-if="isInit"
        :style="{height: `calc(50vh - ${isVisibleToolbar ? '50px' : '25px'})`, position: 'relative', ...panelsWidgetsStyle}"
      />
      <messages
        v-if="isInit && !relatedDataMode"
        ref="messages"
        @action-view-data="data => messageWidgetsActions('object', data)"
        @action-map="data => messageWidgetsActions('position', data)"
        @action-show="data => messageWidgetsActions('show', data)"
        @action-image="data => messageWidgetsActions('image', data)"
        @action-select="data => messageWidgetsActions('select', data)"
        :item="selectedDevice"
        :interval="viewedInterval"
        :dateRange="dateRange"
        :activeId="active"
        :limit="limit"
        :style="[{height: `calc(50vh - ${isVisibleToolbar ? '50px' : '25px'})`, position: 'relative'}, panelsWidgetsStyle]"
        :config="config.messages"
      />
      <intervals
        v-else-if="isInit && relatedDataMode && relatedCalcId"
        ref="relatedIntervals"
        @action-view-data="data => intervalWidgetsActions('object', { ...data, refName: 'relatedIntervals' })"
        @action-map="data => intervalWidgetsActions('track', { ...data, refName: 'relatedIntervals' })"
        @action-show="data => intervalWidgetsActions('show', { ...data, refName: 'relatedIntervals' })"
        @action-select="data => intervalWidgetsActions('select', { ...data, refName: 'relatedIntervals' })"
        :interval="viewedInterval"
        :dateRange="dateRange"
        :activeId="relatedCalcId"
        :item="relatedCalc"
        :activeDeviceId="active"
        :limit="0"
        :config="config.relatedIntervals"
        :style="[{height: `calc(50vh - ${isVisibleToolbar ? '50px' : '25px'})`, position: 'relative'}, panelsWidgetsStyle]"
      />
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
      @close="unselect"
      @next="nextWidgetsMessage"
      @prev="prevWidgetsMessage"
    />
    <widgets
      ref="intervalsView"
      :active="activeWidgetWindow === 'intervalsView'"
      v-model="isWidgetsIntervalsActive"
      :config="intervalsWidgetsViewConfig"
      :actions="widgetsHandleActions"
      :controls="widgetWindowControls"
      :view-model="widgetsViewModel.data"
      @change-view-model="data => widgetsChangeViewModelHandler(entityName, 'data', data)"
      @active="activateWidgetWindow('intervalsView')"
      @close="unselect"
      @next="nextWidgetsInterval"
      @prev="prevWidgetsInterval"
    />
  </q-page>
</template>

<script>
import intervals from '../../components/intervals/Index.vue'
import messages from '../../components/intervals/DevicesMessages.vue'
import MainWidgetsMixin from '../../components/widgets/MainWidgetsMixin'
import MessageWidgetsMixin from '../../components/widgets/MessageWidgetsMixin'
import IntervalsWidgetsMixin from '../../components/widgets/IntervalsWidgetsMixin'
import Widgets from '../../components/widgets/Widgets'
import { mapState, mapActions, mapMutations } from 'vuex'
import init from '../../mixins/entitiesInit'
import routerProcess from '../../mixins/routerProcess'

import Vue from 'vue'

const DEVICE_SOURCE = false,
  CALC_SOURCE = true

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [init, MainWidgetsMixin, MessageWidgetsMixin, IntervalsWidgetsMixin, routerProcess],
  data () {
    const from = this.$route.query.from * 1000,
          to = this.$route.query.to * 1000
    return {
      entityName: 'intervals',
      calcFilter: '',
      deviceFilter: '',
      active: null,
      activeCalcId: null,
      ratio: 50,
      isInit: false,
      isItemsInit: false,
      isDevicesInit: false,
      isCalcsInit: false,
      deviceBlocked: false,
      calcsBlocked: false,
      viewedInterval: null,
      dateRange: [from, to],
      blocked: '',
      relatedDataMode: DEVICE_SOURCE,
      prevRoute: null,
      prevEntity: null
    }
  },
  computed: {
    ...mapState({
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      devicesCollection (state) {
        return state.devices || {}
      },
      tasksCollection (state) {
        return state.tasks || {}
      },
      calcsCollection (state) {
        return state.calcs || {}
      },
      sessionSettings (state) { return state.sessionSettings }
    }),
    devices () {
      return Object.values(this.devicesCollection)
    },
    tasks () {
      const tasks = Object.values(this.tasksCollection)
      return tasks
    },
    calcs () {
      return Object.values(this.calcsCollection)
    },
    selectedDevice () {
      return this.devicesCollection[this.active] || {}
    },
    selectedCalc () {
      return this.calcsCollection[this.activeCalcId] || {}
    },
    relatedCalcId () {
      const source = this.selectedCalc.messages_source || {}
      let id = false
      if (source.source === 'calc') {
        id = source.calc_id
      }
      return id
    },
    relatedCalc () {
      if (this.relatedCalcId && !this.isCalcsInit) {
        this.itemsLoad('calcs', undefined, this.activeCalcId, () => { this.isCalcsInit = true })
      }
      return this.calcsCollection[this.relatedCalcId] || {}
    },
    filteredDevices () {
      let devices = this.devices
      const devicesIdsByTasks = this.tasks.map(task => task.device_id)
      devices = devices.filter(device => devicesIdsByTasks.includes(device.id))
      // if (this.activeCalcId) {
      //   devices = devices.filter(item => this.tasks.some(task => this.active === task.device_id && task.calc_id === this.activeCalcId))
      // }
      return this.filterItems(devices, this.deviceFilter.toLowerCase())
    },
    filteredCalcs () {
      let calcs = this.calcs
      calcs = this.active
        ? calcs.filter(item => this.tasks.some(task => this.active === task.device_id && item.id === task.calc_id))
        : calcs
      // if (this.isInit && this.active && this.activeCalcId && !this.tasks.filter(task => task.device_id === this.active && task.calc_id === this.activeCalcId).length) {
      //   this.$nextTick(() => { this.clearActiveCalc() })
      // }
      return this.filterItems(calcs, this.calcFilter.toLowerCase())
    },
    devicesSelectorDisabled () {
      return (
        !this.isNeedSelect ||
        (typeof isNeedSelect === 'string' && this.isNeedSelect.indexOf('devices') > -1)
      ) || this.deviceBlocked
    },
    calcsSelectorDisabled () {
      return (
        !this.isNeedSelect ||
        (typeof isNeedSelect === 'string' && this.isNeedSelect.indexOf('calcs') > -1)
      ) || this.calcsBlocked
    },
    size () {
      return [this.ratio, 100 - this.ratio]
    },
    hasActiveActions () {
      return this.actions.reduce((res, action) => res || (action && action.condition), false)
    },
    actions () {
      return [
        {
          label: 'Sync intervals',
          icon: 'mdi-table-sync',
          handler: this.recalculateIntervals,
          condition: !!this.active && !!this.activeCalcId,
          desc: 'Recalculate intervals for selected period'
        },
        {
          label: this.relatedDataMode ? 'Messages' : 'Intervals',
          icon: this.relatedDataMode ? 'mdi-card-text-outline' : 'mdi-card-bulleted-outline',
          handler: () => this.updateRoute({
            name: `${this.entityName}`,
            query: {
              related: !this.relatedDataMode ? 'intervals' : 'messages'
            }
          }),
          condition: this.relatedCalcId,
          desc: 'Switch related data between messages/intervals'
        },
        {
          label: 'Devices',
          icon: 'mdi-developer-board',
          handler: this.goBackDevice,
          condition: !!this.active && (this.isNeedSelect === true || (typeof this.isNeedSelect === 'string' && this.isNeedSelect.indexOf('devices') > -1))
        },
        {
          label: 'Calcs',
          icon: 'mdi-calculator-variant',
          handler: this.goBackCalc,
          condition: !!this.activeCalcId && (this.isNeedSelect === true || (typeof this.isNeedSelect === 'string' && this.isNeedSelect.indexOf('calcs') > -1))
        }
      ]
    },
    panelsWidgetsStyle () {
      const style = {}
      const isWidgetActive = (this.isWidgetsMessageActive || this.isWidgetsIntervalsActive)
      const isTwoSide = (this.widgetStyle.left && this.widgetStyle.right) && isWidgetActive
      const isLeftSide = this.widgetStyle.left && isWidgetActive
      const isRightSide = this.widgetStyle.right && isWidgetActive
      if (isTwoSide) {
        style.maxWidth = 'calc(100% - 600px)'
        style.left = '300px'
      } else if (isLeftSide || isRightSide) {
        style.maxWidth = 'calc(100% - 300px)'
        if (isRightSide) { style.left = '300px' }
      }
      return style
    }
  },
  methods: {
    filterItems (items, filter) {
      const filteredItems = filter ? items.filter(item => {
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
    ...mapActions(['getDeleted']),
    ...mapMutations(['setToolboxSessionSettings']),
    filterDevicesSelectItems (filter, update) {
      if (this.isDevicesInit) {
        update()
        return
      }
      this.itemsLoad('devices', update, this.active, () => { this.isDevicesInit = true })
    },
    filterCalcsSelectItems (filter, update) {
      if (this.isCalcsInit) {
        update()
        return
      }
      this.itemsLoad('calcs', update, this.activeCalcId, () => { this.isCalcsInit = true })
    },
    // viewDataMessageHandler (content) {
    //   if (content) {
    //     if (!this.viewedInterval) {
    //       this.$refs.intervals.unselect()
    //     }
    //     this.$emit('view-data', content)
    //   }
    // },
    onMapHandler (routes) {
      if (!this.isVisibleMap) {
        this.openMapHandler()
        this.$nextTick(() => {
          this.$refs.map.clear().addRoutes(routes).send()
        })
        return false
      }
      if (this.$refs.map && this.isVisibleMap) {
        this.$refs.map.clear().addRoutes(routes).send()
      }
    },
    unselect () {
      this.$refs.intervals.unselect()
      this.$refs.messages && this.$refs.messages.unselect()
      this.$refs.relatedIntervals && this.$refs.relatedIntervals.unselect()
      this.viewedInterval = null
    },
    setActive (id) {
      if (id) {
        this.updateRoute({name: `${this.entityName}`, params: { deviceId: id, calcId: this.activeCalcId }}, !this.active)
      }
    },
    setActiveCalc (id) {
      if (id) {
        this.updateRoute({name: `${this.entityName}`, params: { calcId: id, deviceId: this.active }}, !this.activeCalcId)
      }
      // this.activeCalcId = id
    },
    clearActive () {
      this.setActive(null)
    },
    clearActiveCalc () {
      this.setActiveCalc(null)
    },
    recalculateIntervals () {
      this.$q.dialog({
        title: 'Warning!',
        message: 'Recalculate intervals for selected period?',
        color: 'white',
        class: 'text-white bg-red',
        cancel: true,
        ok: 'Recalculate',
        noRouteDismiss: true
      }).onOk(async () => {
        if (this.dateRange.length === 2) {
          const data = { from: this.dateRange[0] / 1000, to: this.dateRange[1] / 1000 }
          await Vue.connector.http.post(`/gw/calcs/${this.activeCalcId}/devices/${this.active}/recalculate`, data).then((response) => {}, (response) => {})
          setTimeout(() => this.$refs.intervals.refresh(), 1000)
        }
      })
      //
    },
    goBackDevice () {
      if (this.prevEntity === 'devices' && this.prevRoute && this.prevRoute.params.id === this.active) {
        this.$router.push(this.prevRoute).catch(err => err)
      } else {
        this.$router.push(`/devices/${this.active}`).catch(err => err)
      }
    },
    goBackCalc () {
      if (this.prevEntity === 'calcs' && this.prevRoute && this.prevRoute.params.id === this.activeCalcId) {
        this.$router.push(this.prevRoute).catch(err => err)
      } else {
        this.$router.push(`/calcs/${this.activeCalcId}`).catch(err => err)
      }
    },
    init () {
      this.blocked = this.$route.query.noselect || ''
      const deviceIdFromRoute = this.$route.params && this.$route.params.deviceId ? Number(this.$route.params.deviceId) : null,
        calcIdFromRoute = this.$route.params && this.$route.params.calcId ? Number(this.$route.params.calcId) : null
      const viewMode = this.$route.query.related
      if (viewMode) {
        if (viewMode === 'messages') {
          this.relatedDataMode = DEVICE_SOURCE
        } else if (viewMode === 'intervals') {
          this.relatedDataMode = CALC_SOURCE
        }
      }
      if (deviceIdFromRoute) {
        this.active = deviceIdFromRoute
        // this.setActive(deviceIdFromRoute)
      }
      if (calcIdFromRoute) {
        this.activeCalcId = calcIdFromRoute
        // this.setActiveCalc(calcIdFromRoute)
      }
      this.isInit = true
      this.updateRoute({
        name: `${this.entityName}`,
        params: {
          deviceId: this.active,
          calcId: this.activeCalcId
        },
        query: {
          related: this.relatedDataMode ? 'intervals' : 'messages'
        }
      }, true)
      this.$emit('inited')
    },
    clearWidgetsState () {
      this.isWidgetsMessageActive = false
      this.isWidgetsIntervalsActive = false
      this.activeWidgetWindow = undefined
      this.widgetsViewedMessage = null
      this.widgetsVieweInterval = null
    },
    beforeEnableWidgetByPane (entity) {
      if (!this.widgetStyle.left && !this.isWidgetsMessageActive && !this.isWidgetsIntervalsActive && !this.widgetsViewModel.data) {
        this.$nextTick(() => this.widgetsChangeViewModelHandler(this.entityName, 'data', { type: 'minimized', to: 'left' }))
      }
      switch (entity) {
        case 'messages': {
          this.isWidgetsIntervalsActive = false
          break
        }
        case 'intervals': {
          this.isWidgetsMessageActive = false
          this.closeMessageWidgetsHandler()
          break
        }
      }
    },
    onResizePage (size) {
      this.$refs.intervalsView.resize(size)
      this.$refs.messagesView.resize(size)
    },
    changeRelatedDataMode (val) {
      val = val === 'intervals'
      if (val === this.relatedDataMode) { return false }
      this.unselect()
      if (this.isWidgetsMessageActive) { this.isWidgetsMessageActive = false }
      if (this.isWidgetsIntervalsActive && this.widgetsViewedInterval.refName.indexOf('related') === 0) { this.isWidgetsIntervalsActive = false }
      this.relatedDataMode = !this.relatedDataMode
    },
    changeNoSelectMode (val) {
      if (val === 'calcs' || (!val && this.calcs.length)) {
        this.deviceBlocked = false
        this.calcsBlocked = true
      } else if (val === 'devices' || (!val && this.devices.length)) {
        this.deviceBlocked = true
        this.calcsBlocked = false
      } else {
        this.deviceBlocked = false
        this.calcsBlocked = true
      }
    },
    dateRangeChange (range) {
      this.viewedInterval = null
      this.updateRoute({
        query: {
          from: range[0] / 1000,
          to: range[1] / 1000
        }
      })
    },
  },
  created () {
    if (this.sessionSettings && this.sessionSettings.intervalDevicesBlocked) {
      this.deviceBlocked = true
    }
    if (this.sessionSettings && this.sessionSettings.intervalCalcsBlocked) {
      this.calcsBlocked = true
    }
  },
  beforeDestroy () {
    this.setToolboxSessionSettings({
      intervalDevicesBlocked: undefined,
      intervalCalcsBlocked: undefined
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.meta.moduleName !== to.meta.moduleName) {
        vm.prevRoute = from
        vm.prevEntity = from.meta.moduleName
      }
    })
  },
  watch: {
    $route (route) {
      this.processRoute({
        related: (val) => { this.changeRelatedDataMode(val) },
        noselect: (val) => { this.changeNoSelectMode(val) }
      }, route)
      const begin = route.query.from * 1000,
        end = route.query.to * 1000
      if (this.dateRange[0] !== begin || this.dateRange[1] !== end) {
        this.dateRange = [begin, end]
      }
      if (
        route.params && route.params.deviceId && Number(route.params.deviceId) === this.active &&
        route.params.calcId && this.activeCalcId === Number(route.params.calcId)
      ) { return false }
      if (route.params && route.params.deviceId) {
        const deviceId = Number(route.params.deviceId)
        if (this.devicesCollection[deviceId]) {
          if (deviceId !== this.active) {
            this.active = deviceId
          }
          const calcId = Number(route.params.calcId)
          if (route.params && route.params.calcId && this.calcsCollection[calcId]) {
            this.activeCalcId = calcId
          }
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.deviceId) {
        this.active = null
      }
      this.clearWidgetsState()
    }
  },
  components: { intervals, messages, Widgets }
}
</script>
<style lang="stylus">
  .intervals-page
    .middle-modificator
      position absolute
      left calc(50% - 71px)
    .items__select
      max-width 100%
      .q-field__control
        height 100%
        padding-top 2px
      &--no-selected
        width 180px
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
