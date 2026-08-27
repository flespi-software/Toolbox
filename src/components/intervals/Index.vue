<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :class="{'non-selectable': selectionMode}"
      name="IntervalsVirtualScroll"
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
      @click="tableClickHandler"
      @scroll="scrollHandler"
      @action="actionHandler"
      @change-filter="filterChangeHandler"
      @change-date-range="dateRangeChangeHandler"
      @update-cols="updateColsHandler"
      @action-to-bottom="actionToBottomHandler"
      @arrowup="arrowUpHandler"
      @arrowdown="arrowDownHandler"
    >
      <template #empty><empty-pane  :config="config.emptyState"/></template>
    </virtual-scroll-list>
  </div>
</template>

<script>
/* a component definition in data() would be handed to Vue as a reactive proxy */
import { markRaw } from 'vue'
import { VirtualScrollList } from 'src/qvirtualscroll'
import { useIntervalsStore } from 'src/qvirtualscroll/stores/intervals'
import { connector } from 'src/services/connector'
import { useMainStore } from 'src/stores/main'
import settingsStorage from 'src/infrastructure/settingsStorage'
import debounce from 'lodash/debounce'
import { copyToClipboard } from 'quasar'
import MessagesListItem from './MessagesListItem.vue'
import EmptyPane from '../EmptyPane.vue'
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
  setup (props) {
    const mainStore = useMainStore()
    /*
     * The Vue 2 build registered a Vuex module named after the list and dropped it again. The store
     * registry keeps the same one-per-list identity.
     */
    const listStore = useIntervalsStore({
      name: props.isSecondary ? 'intervals' : props.config.vuexModuleName,
      lsNamespace: 'flespi-toolbox-settings.cols',
      storage: settingsStorage,
      errorHandler: (err) => { mainStore.reqFailed(err) }
    })
    return { mainStore, listStore }
  },
  data () {
    return {
      listItem: markRaw(MessagesListItem),
      theme: this.config.theme,
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
        let messages = this.listStore.messages
        messages = Object.values(messages)
        messages.sort((a, b) => {
          return a.begin - b.begin
        })
        this.normalizeSelected(messages)
        return messages
      },
      set (val) {
        this.listStore.setMessages(val)
      }
    },
    active: {
      get () {
        return this.listStore.active
      },
      async set (val) {
        await this.listStore.unsubscribePooling()/* remove subscription for previous active device */
        this.listStore.setActive(val)
        this.listStore.clearMessages()
        const counters = this.item.counters || []
        val && this.listStore.getCols(counters)
        await this.listStore.initTime()
        this.$emit('change:date-range', [this.begin, this.end])
        await this.listStore.get()
        this.listStore.pollingGet()
      }
    },
    activeDevice: {
      get () {
        return this.listStore.activeDevice
      },
      async set (id) {
        await this.listStore.unsubscribePooling()/* remove subscription for previous active device */
        this.listStore.setActiveDevice(id)
        this.listStore.clearMessages()
        await this.listStore.initTime()
        this.$emit('change:date-range', [this.begin, this.end])
        await this.listStore.get()
        this.listStore.pollingGet()
      }
    },
    cols: {
      get () {
        return this.listStore.cols
      },
      set (val) {
        this.listStore.updateCols(val)
      }
    },
    filter: {
      get () {
        return this.listStore.filter
      },
      set (val) {
        val = val || ''
        this.listStore.setFilter(val)
      }
    },
    begin: {
      get () {
        const begin = this.isSecondary ? this.dateRange[0] : this.listStore.begin
        return begin
      },
      set (val) {
        val = val || 0
        this.listStore.setBegin(val)
      }
    },
    end: {
      get () {
        const end = this.isSecondary ? this.dateRange[1] : this.listStore.end
        return end
      },
      set (val) {
        val = val || 0
        this.listStore.setEnd(val)
      }
    },
    reverse: {
      get () {
        return this.listStore.reverse || false
      },
      set (val) {
        this.listStore.setReverse(val)
      }
    },
    currentLimit: {
      get () {
        return this.listStore.limit
      },
      set (val) {
        val = val || 0
        this.listStore.setLimit(val)
      }
    },
    selected: {
      get () {
        const selected = this.listStore.selected
        if (selected && !selected.length) {
          this.$emit('view-data', null)
        }
        return selected
      },
      set (val) {
        this.listStore.setSelected(val)
        this.updateSelectedRoute(this.selectedMessagesTimestamps)
      }
    },
    selectedMessagesTimestamps () {
      let messages = undefined
      if (this.selected.length) {
        messages = this.selected.map(index => this.messages[index].timestamp)
      }
      return messages
    },
    loadingFlag () {
      return !!this.listStore.isLoading
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
    },
    viewConfig () {
      /* merging into `this.config.viewConfig` wrote into the shared config for good */
      return Object.assign({}, this.config.viewConfig, { needKeysProcess: !!this.selected.length })
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
          if (this.realtimeEnabled) { this.listStore.unsubscribePooling() }
          this.filter = params.filter || null
          needUpdate = true
        }
        if (needUpdate) {
          this.listStore.clearMessages()
          this.listStore.get()
        }
      } catch (e) {}
    },
    scrollHandler ({ event, data }) {
      const index = Math.floor(data.start + ((data.end - data.start) / 4))
      const message = this.messages[index]
      const timestamp = message.timestamp
      this.scrollTimestamp = timestamp
      this.debouncedUpdateMessagesRoute({}, true)
    },
    updateSelectedRoute (selected) {
      this.updateMessagesRoute({ selected })
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.updateMessagesRoute({ filter: val || undefined })
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    refresh () {
      this.$emit('change:date-range', [ this.begin, this.end ])
      this.viewedInterval = null
      this.listStore.clearMessages()
      this.listStore.get()
    },
    dateRangeChange (range) {
      const begin = range[0],
        end = range[1]
      this.begin = begin
      this.end = end
      this.$emit('change:date-range', range)
      this.viewedInterval = null
      this.listStore.clearMessages()
      this.listStore.get()
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
            this.mainStore.token,
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
        this.listStore.messages = []
        const intervalMessages = await this.listStore.getMessages({ from: interval.begin, to: interval.end + 0.999999, count: this.limit })
        const count = Math.ceil((this.limit - intervalMessages.length) / 2)
        let scrollToIndex = 0
        if (intervalMessages.length < this.limit) {
          const paddingMessages = await Promise.all([
            this.listStore.getMessages({ from: this.from / 1000, to: interval.begin - 0.000001, count, reverse: true }),
            this.listStore.getMessages({ from: interval.end + 1, to: this.to / 1000, count })
          ])
          const prevMsgs = paddingMessages[0].reverse(),
            nextMsgs = paddingMessages[1]
          intervalMessages.splice(0, 0, ...prevMsgs)
          scrollToIndex = prevMsgs.length
          intervalMessages.splice(intervalMessages.length, 0, ...nextMsgs)
          await this.listStore.unsubscribePooling()
        } else {
          await this.listStore.unsubscribePooling()
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
    routeConfigProcess (routeConfig = {}) {
      const res = {}
      try {
        routeConfig = JSON.parse(routeConfig)
      } catch (e) {}
      if (routeConfig.filter) { res.filter = routeConfig.filter }
      if (routeConfig.scroll) {
        this.scrollTimestamp = routeConfig.scroll
        res.initTimestamp = routeConfig.scroll
      }
      if (routeConfig.selected) {
        res.selected = routeConfig.selected
        res.initTimestamp = routeConfig.selected[0]
      }
      return res
    },
    async init () {
      /* a list that had already been set up used to be cleared instead of re-registered */
      if (this.listStore.initialized) {
        this.listStore.clear()
      } else {
        this.listStore.initialized = true
      }
      this.currentLimit = this.limit
      if (this.activeId) {
        this.listStore.setActive(this.activeId)
        const counters = this.item.counters || []
        this.listStore.getCols(counters)
      }
      if (this.activeDeviceId) {
        this.listStore.setActiveDevice(this.activeDeviceId)
      }
      const from = this.$route.query.from * 1000,
          to = this.$route.query.to * 1000
      const routeConfig = this.$route.query[this.routeParamName]
      let {
          filter,
          initTimestamp,
          selected
        } = this.routeConfigProcess(routeConfig)

        this.filter = filter
      if (this.isSecondary) {
        this.begin = this.dateRange[0]
        this.end = this.dateRange[1]
        await this.listStore.get()
      } else {
        if (from && to) {
          this.begin = from
          this.end = to
        } else {
          await this.listStore.initTime()
        }
        this.$emit('change:date-range', [this.begin, this.end])
        await this.listStore.get()
        await this.listStore.pollingGet()
      }
      if (initTimestamp) {
        const scrollIndex = this.messages.findIndex((message) => { return message.timestamp === initTimestamp })
        this.scrollTo(scrollIndex)
      }
      this.initSelectedByTimestamps(selected)
      this.updateMessagesRoute({}, true)
      this.isInit = true
    },
    initSelectedByTimestamps (selected) {
      if (selected) {
        const { indexes, messages } = this.messages.reduce((res, message, index) => {
          if (selected.includes(message.timestamp)) {
            res.messages.push(message)
            res.indexes.push(index)
          }
          return res
        }, {indexes: [], messages: []})
        this.selected = indexes
        this.$emit('action-view-data', { index: indexes[indexes.length - 1], content: messages, entity: this.item })
        this.inMessagesHandler({
          content: messages[0]
        })
      }
    },
    updateMessagesRoute (patch = {}, rewrite = false) {
      const messagesParams = {...{
        filter: this.filter || undefined,
        scroll: this.scrollTimestamp,
        selected: this.selectedMessagesTimestamps
      }, ...patch}
      this.updateRoute({  query: { [this.routeParamName]: JSON.stringify(messagesParams) } }, rewrite)
    },
    arrowDownHandler () {
      const index = this.selected.slice(-1)[0] + 1
      const content = this.messages[index]
      if (content) {
        const payload = {
          type: 'view',
          content,
          index
        }
        this.viewMessagesAndShowInMessagesHandler(payload)
      }
    },
    arrowUpHandler () {
      const index = this.selected[0] - 1
      const content = this.messages[index]
      if (content) {
        const payload = {
          type: 'view',
          content,
          index
        }
        this.viewMessagesAndShowInMessagesHandler(payload)
      }
    },
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
    this.debouncedUpdateMessagesRoute = debounce(this.updateMessagesRoute, 500, { trailing: true, maxWait: 1000 })
    this.init()
    this.offlineHandler = connector.socket.on('offline', () => {
      this.listStore.setOffline()
    })
    this.connectHandler = connector.socket.on('connect', () => {
      if (this.listStore.offline) {
        this.listStore.setReconnected()
        this.listStore.clearOfflineState()
      }
    })
  },
  beforeUnmount () {
    this.listStore.unsubscribePooling()
    this.offlineHandler !== undefined && connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && connector.socket.off('connect', this.connectHandler)
    this.listStore.clear()
    this.listStore.setActive(null)
    this.listStore.setActiveDevice(null)
  },
  mixins: [actions, routerProcess, testExpressionsMixin, multiselectMixin],
  components: { VirtualScrollList, EmptyPane }
}
</script>
