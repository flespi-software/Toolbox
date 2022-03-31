<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :class="{'non-selectable': selectionMode}"
      :cols="cols"
      :actions="actions"
      :panelActions="panelActions"
      :items="messages"
      :dateRange="[begin, end]"
      :viewConfig="viewConfig"
      :filter="filter"
      :theme="theme"
      :title="'Intervals'"
      :loading="loadingFlag"
      :autoscroll="needAutoscroll"
      scrollOffset="10%"
      :i18n="i18n"
      :item="listItem"
      :itemprops="getItemsProps"
      @click.native="tableClickHandler"
      @scroll="scrollHandler"
      @action="actionHandler"
      @change-filter="filterChangeHandler"
      @change-date-range="dateRangeChangeHandler"
      @update-cols="updateColsHandler"
      @action-to-bottom="actionToBottomHandler"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, intervalsModule } from 'qvirtualscroll'
import Vue from 'vue'
import { copyToClipboard } from 'quasar'
import MessagesListItem from './MessagesListItem.vue'
import EmptyPane from '../EmptyPane'
import actions from '../../mixins/actions'
import routerProcess from '../../mixins/routerProcess'
import { ACTION_MODE_MULTI, ACTION_MODE_SINGLE } from '../../config'
import testExpressionsMixin from '../../mixins/testExpressionsMixin'
import multiselectMixin from '../../mixins/multiselectMixin'

export default {
  props: [
    'item',
    'activeId',
    'activeDeviceId',
    'limit',
    'config',
    'interval',
    'dateRange'
  ],
  data () {
    return {
      listItem: MessagesListItem,
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      isSecondary: this.config.mode === 'secondary',
      routeParamName: this.config.mode === 'secondary' ? 'related_intervals' : 'intervals',
      moduleName: this.config.vuexModuleName,
      autoscroll: true,
      isInit: false,
      scrollTimestamp: undefined,
      viewedInterval: null,
      actions: this.config.actions,
      i18n: {
        'Columns by schema': 'Columns by counters'
      }
    }
  },
  computed: {
    messages: {
      get () {
        let messages = this.$store.state[this.moduleName].messages
        messages = Object.values(messages)
        messages.sort((a, b) => {
          return a.begin - b.begin
        })
        this.normalizeSelected(messages)
        return messages
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setMessages`, val)
      }
    },
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (val) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active device */
        this.$store.commit(`${this.moduleName}/setActive`, val)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        const counters = this.item.counters || []
        val && this.$store.dispatch(`${this.moduleName}/getCols`, counters)
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        this.$emit('change:date-range', [this.begin, this.end])
        await this.$store.dispatch(`${this.moduleName}/get`)
        this.$store.dispatch(`${this.moduleName}/pollingGet`)
      }
    },
    activeDevice: {
      get () {
        return this.$store.state[this.moduleName].activeDevice
      },
      async set (id) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active device */
        this.$store.commit(`${this.moduleName}/setActiveDevice`, id)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        this.$emit('change:date-range', [this.begin, this.end])
        await this.$store.dispatch(`${this.moduleName}/get`)
        this.$store.dispatch(`${this.moduleName}/pollingGet`)
      }
    },
    cols: {
      get () {
        return this.$store.state[this.moduleName].cols
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/updateCols`, val)
      }
    },
    filter: {
      get () {
        return this.$store.state[this.moduleName].filter
      },
      set (val) {
        val = val || ''
        this.$store.commit(`${this.moduleName}/setFilter`, val)
      }
    },
    begin: {
      get () {
        const begin = this.isSecondary ? this.dateRange[0] : this.$store.state[this.moduleName].begin
        return begin
      },
      set (val) {
        val = val || 0
        this.$store.commit(`${this.moduleName}/setBegin`, val)
      }
    },
    end: {
      get () {
        const end = this.isSecondary ? this.dateRange[1] : this.$store.state[this.moduleName].end
        return end
      },
      set (val) {
        val = val || 0
        this.$store.commit(`${this.moduleName}/setEnd`, val)
      }
    },
    reverse: {
      get () {
        return this.$store.state[this.moduleName].reverse || false
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setReverse`, val)
      }
    },
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (val) {
        val = val || 0
        this.$store.commit(`${this.moduleName}/setLimit`, val)
      }
    },
    selected: {
      get () {
        const selected = this.$store.state[this.moduleName].selected
        if (selected && !selected.length) {
          this.$emit('view-data', null)
        }
        return selected
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setSelected`, val)
      }
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    },
    needAutoscroll () {
      return !this.selected.length && this.autoscroll
    },
    routesFields () {
      const routesFields = this.item.counters && this.item.counters.filter((counter) => {
        return counter.type === 'route'
      })
      return routesFields || []
    },
    panelActions () {
      return [
        {
          label: 'Export CSV',
          icon: 'mdi-file-document-outline',
          handler: () => this.exportCsv(
            {
              filter: `${this.filter}`,
              begin: Math.floor(this.begin / 1000),
              end: Math.floor(this.end / 1000)
            },
            {
              from: this.begin,
              to: this.end
            },
            'intervals'
          ),
          condition: this.messages.length,
          tooltip: 'Save messages to CSV',
          async: this.isFileCsvLoading
        }
      ]
    }
  },
  methods: {
    tableClickHandler (event) {
      if (!event.target.closest('.list-item--click-control')) {
        this.selected = []
        this.$emit('action-view-data', { index: -1, content: [] })
      }
    },
    getItemsProps (index, data) {
      const item = this.messages[index]
      data.key = item['x-flespi-message-key']
      data.class = 'list-item list-item--click-control'
      data.props.etcVisible = this.etcVisible
      data.props.actionsVisible = this.actionsVisible
      data.props.selected = this.selected.includes(index)
      data.props.actions = () => this.getItemPropsActions(item, data)
      data.props.highlighted = (this.viewedInterval && item.id === this.viewedInterval.id) ||
        (this.interval && item.begin >= this.interval.begin && item.end <= this.interval.end)
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessagesAndShowInMessagesHandler
      data.dataHandler = (col, row, data) => {
        this.autoscroll = false
        return this.listItem.methods.getValueOfProp(col.data, row.data)
      }
    },
    getItemPropsActions (item, data) {
      const selectMode = this.selected.length > 1 ? ACTION_MODE_MULTI : ACTION_MODE_SINGLE
      const actions = [...this.config.actions.filter(action => action.mode === selectMode)]
      if (selectMode === ACTION_MODE_SINGLE) {
        if (this.routesFields.some(field => !!item[field.name])) {
          actions.push({
            icon: 'mdi-map',
            label: 'Show on map',
            classes: '',
            type: 'map'
          })
        }
      }
      actions.push({
        icon: 'mdi-function',
        label: 'Test expression',
        classes: '',
        type: 'expression'
      })
      return actions
    },
    resetParams () {
      this.$refs.scrollList.resetParams()
    },
    processQuery (params) {
      if (!this.isInit) { return false }
      try {
        params = params ? JSON.parse(params) : {}
        let needUpdate = false
        if (
          (!this.filter && !!params.filter) ||
          (!!this.filter && !params.filter) ||
          (this.filter && params.filter && this.filter !== params.filter)
        ) {
          if (this.realtimeEnabled) { this.$store.dispatch(`${this.moduleName}/unsubscribePooling`) }
          this.filter = params.filter || null
          needUpdate = true
        }
        if (needUpdate) {
          this.$store.commit(`${this.moduleName}/clearMessages`)
          this.$store.dispatch(`${this.moduleName}/get`)
        }
      } catch (e) {}
    },
    scrollHandler ({ event, data }) {
      const index = Math.floor(data.start + ((data.end - data.start) / 4))
      const message = this.messages[index]
      const timestamp = message.timestamp
      this.scrollTimestamp = timestamp
      this.updateRoute({
        query: {
          [this.routeParamName]: JSON.stringify({
            filter: this.filter || undefined,
            scroll: this.scrollTimestamp
          })
        }
      })
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.updateRoute({
        query: {
          [this.routeParamName]: JSON.stringify({
            filter: val || undefined,
            scroll: this.scrollTimestamp
          })
        }
      })
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    dateRangeChange (range) {
      const begin = range[0],
        end = range[1]
      this.begin = begin
      this.end = end
      this.$emit('change:date-range', range)
      this.viewedInterval = null
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/get`)
    },
    dateRangeChangeHandler (range) {
      const begin = range[0],
        end = range[1]
      if (this.begin === begin && this.end === end) { return false }
      this.dateRangeChange(range)
    },
    actionHandler ({ index, type, content }) {
      if (this.selected.length > 1) {
        content = this.selected.map(index => this.messages[index])
      }
      switch (type) {
        case 'view': {
          this.itemClickHandler({ index, content, entity: this.item })
          break
        }
        case 'copy': {
          this.copyMessageHandler({ index, content, entity: this.item })
          break
        }
        case 'expression': {
          this.showExprTest(
            this.$store.state.token,
            this.cols.schemas[this.cols.activeSchema].cols,
            this.selected.map(index => this.messages[index])
          )
          break
        }
        default: {
          this.$emit(`action-${type}`, { index, content: [content], entity: this.item })
          break
        }
      }
    },
    actionToBottomHandler () {
      this.autoscroll = true
      this.$refs.scrollList.scrollTo(this.messages.length - 1)
    },
    viewMessagesAndShowInMessagesHandler ({ index, content, event }) {
      this.itemClickHandler({ index, content, entity: this.item, event })
      if (this.selected.length === 1) {
        this.inMessagesHandler({ index, content })
      } else {
        this.inMessagesHandler({ index, content: undefined })
      }
    },
    itemClickHandler ({ index, content, entity, event }) {
      this.selected = this.multiselectProcess({index, event, selected: this.selected})
      const messages = this.selected.map(index => this.messages[index])
      this.$emit('action-view-data', { index, content: messages, entity })
    },
    inMessagesHandler ({ index, content }) {
      this.viewedInterval = content
      this.$emit('in-messages', this.viewedInterval)
    },
    copyMessageHandler ({ index, content }) {
      copyToClipboard(JSON.stringify(content)).then((e) => {
        this.$q.notify({
          type: 'positive',
          icon: 'content_copy',
          message: 'Message copied',
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          type: 'negative',
          icon: 'content_copy',
          message: 'Error coping messages',
          timeout: 1000
        })
      })
    },
    unselect () {
      if (this.selected.length) {
        this.viewedInterval = null
        this.selected = []
      }
    },
    normalizeSelected (messages) {
      if (this.selected && this.selected.length && !this.viewedInterval) {
        const selectedIndex = this.selected[0]
        this.$emit('action-view-data', { index: selectedIndex, content: messages, entity: this.item })
      }
    },
    scrollTo (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollTo(index))
    },
    async showMessagesByInterval () {
      const interval = this.interval
      if (!interval) { return }
      const existMessageIndex = this.messages.findIndex(message => message.begin === interval.begin)
      if (existMessageIndex !== -1) {
        this.scrollTo(existMessageIndex - 1)
      } else {
        this.$store.state[this.moduleName].messages = []
        const intervalMessages = await this.$store.dispatch(`${this.moduleName}/getMessages`, { from: interval.begin, to: interval.end + 0.999999, count: this.limit })
        const count = Math.ceil((this.limit - intervalMessages.length) / 2)
        let scrollToIndex = 0
        if (intervalMessages.length < this.limit) {
          const paddingMessages = await Promise.all([
            this.$store.dispatch(`${this.moduleName}/getMessages`, { from: this.from / 1000, to: interval.begin - 0.000001, count, reverse: true }),
            this.$store.dispatch(`${this.moduleName}/getMessages`, { from: interval.end + 1, to: this.to / 1000, count })
          ])
          const prevMsgs = paddingMessages[0].reverse(),
            nextMsgs = paddingMessages[1]
          intervalMessages.splice(0, 0, ...prevMsgs)
          scrollToIndex = prevMsgs.length
          intervalMessages.splice(intervalMessages.length, 0, ...nextMsgs)
          await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
        } else {
          await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
        }
        this.scrollTo(scrollToIndex)
      }
    },
    nextSelect () {
      if (this.selected.length) {
        const lastIndex = this.selected.slice(-1)[0]
        const newIndex = lastIndex + 1
        const message = this.messages[newIndex]
        if (message) {
          this.selected = [newIndex]
          const content = message
          this.$emit('action-select', {
            index: newIndex,
            content: [content],
            entity: this.item
          })
          this.inMessagesHandler({ index: newIndex, content })
          this.scrollTo(newIndex)
        }
      }
    },
    prevSelect () {
      if (this.selected.length) {
        const firstIndex = this.selected[0]
        const newIndex = firstIndex - 1
        const message = this.messages[newIndex]
        if (message) {
          this.selected = [newIndex]
          const content = message
          this.$emit('action-select', {
            index: newIndex,
            content: [content],
            entity: this.item
          })
          this.inMessagesHandler({ index: newIndex, content })
          this.scrollTo(newIndex)
        }
      }
    },
    async init () {
      if (!this.$store.state[this.moduleName]) {
        this.$store.registerModule(this.moduleName, intervalsModule({ Vue, LocalStorage: this.$q.localStorage, name: { name: this.isSecondary ? 'intervals' : this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' }, errorHandler: (err) => { this.$store.commit('reqFailed', err) } }))
      } else {
        this.$store.commit(`${this.moduleName}/clear`)
      }
      this.currentLimit = this.limit
      if (this.activeId) {
        this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
        const counters = this.item.counters || []
        this.$store.dispatch(`${this.moduleName}/getCols`, counters)
      }
      if (this.activeDeviceId) {
        this.$store.commit(`${this.moduleName}/setActiveDevice`, this.activeDeviceId)
      }
      const from = this.$route.query.from * 1000,
          to = this.$route.query.to * 1000
      let routeConfig = this.$route.query[this.routeParamName]
      if (routeConfig) {
        try {
          routeConfig = JSON.parse(routeConfig)
          if (routeConfig.filter) { this.filter = routeConfig.filter }
          if (routeConfig.scroll) {
            this.scrollTimestamp = routeConfig.scroll
          }
        } catch (e) {}
      }
      if (this.isSecondary) {
        this.begin = this.dateRange[0]
        this.end = this.dateRange[1]
        await this.$store.dispatch(`${this.moduleName}/get`)
      } else {
        if (from && to) {
          this.begin = from
          this.end = to
        } else {
          await this.$store.dispatch(`${this.moduleName}/initTime`)
        }
        this.$emit('change:date-range', [this.begin, this.end])
        await this.$store.dispatch(`${this.moduleName}/get`)
        await this.$store.dispatch(`${this.moduleName}/pollingGet`)
      }
      if (this.scrollTimestamp) {
        const scrollIndex = this.messages.findIndex((message) => { return message.timestamp === this.scrollTimestamp })
        this.scrollTo(scrollIndex)
      }
      this.updateRoute({
        query: {
          [this.routeParamName]: JSON.stringify({
            filter: this.filter || undefined,
            scroll: this.scrollTimestamp
          })
        }
      }, true)
      this.isInit = true
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    },
    activeDeviceId (id) {
      this.activeDevice = id
    },
    limit (limit) {
      this.currentLimit = limit
    },
    interval () {
      this.showMessagesByInterval()
    },
    dateRange (range) {
      this.dateRangeChange(range)
    },
    $route (route) {
      this.processRoute({
        [this.routeParamName]: this.processQuery,
      }, route)
    }
  },
  created () {
    this.init()
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`)
        this.$store.commit(`${this.moduleName}/clearOfflineState`)
      }
    })
  },
  beforeDestroy () {
    this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
    this.offlineHandler !== undefined && Vue.connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && Vue.connector.socket.off('connect', this.connectHandler)
    this.$store.commit(`${this.moduleName}/clear`)
    this.$store.commit(`${this.moduleName}/setActive`, null)
    this.$store.commit(`${this.moduleName}/setActiveDevice`, null)
  },
  mixins: [actions, routerProcess, testExpressionsMixin, multiselectMixin],
  components: { VirtualScrollList, EmptyPane }
}
</script>
