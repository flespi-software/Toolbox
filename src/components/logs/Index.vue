<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :class="{'non-selectable': selectionMode}"
      name="LogsVirtualScroll"
      :cols="cols"
      :actions="actions"
      :panelActions="panelActions"
      :items="messages"
      :dateRange="dateRange"
      :viewConfig="viewConfig"
      :i18n="i18n"
      :filter="filter"
      :theme="theme"
      :title="'Logs'"
      :loading="loadingFlag"
      :autoscroll="needAutoscroll"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      :has-new-messages="hasNewMessages"
      @click="tableClickHandler"
      @scroll="scrollHandler"
      @action="actionHandler"
      @change-filter="filterChangeHandler"
      @scroll-top="paginationPrevChangeHandler"
      @scroll-bottom="paginationNextChangeHandler"
      @change-date-range="dateRangeChangeHandler"
      @action-to-bottom="actionToBottomHandler"
      @action-to-new-messages="actionToNewMessages"
      @action-to-new-messages-hide="actionToNewMessagesHide"
      @update-cols="updateColsHandler"
      @arrowup="arrowUpHandler"
      @arrowdown="arrowDownHandler"
    >
      <template #empty>
        <empty-pane :config="config.emptyState"/>
      </template>
      <template #filter-append>
        <logs-filter-menu v-if="isInit" :filter="filter" :entity="entityName" @update="filterChangeHandler"/>
      </template>
    </virtual-scroll-list>
  </div>
</template>

<script>
/* a component definition in data() would be handed to Vue as a reactive proxy */
import { markRaw } from 'vue'
import { date, copyToClipboard } from 'quasar'
import debounce from 'lodash/debounce'
import { VirtualScrollList } from 'src/qvirtualscroll'
import { useLogsStore } from 'src/qvirtualscroll/stores/logs'
import ItemMixin from './ItemMixin'
import { connector } from 'src/services/connector'
import { useMainStore } from 'src/stores/main'
import settingsStorage from 'src/infrastructure/settingsStorage'
import LogsListItem from './LogsListItem.vue'
import LogsFilterMenu from './LogsFilterMenu.vue'
import EmptyPane from '../EmptyPane.vue'
import routerProcess from '../../mixins/routerProcess'
import { ACTION_MODE_MULTI, ACTION_MODE_SINGLE } from '../../config'
import testExpressionsMixin from '../../mixins/testExpressionsMixin'
import multiselectMixin from '../../mixins/multiselectMixin'
import actions from '../../mixins/actions'
import liveTail from '../../mixins/liveTail'


export default {
  name: 'LogsViewer',
  emits: [
    'view-log-message',
    'to-traffic',
    'to-error-traffic',
    'action-timeSync',
    'action-select'
  ],
  props: [
    'item',
    'cid',
    'limit',
    'originPattern',
    'config',
    'entityName',
    'itemtype'
  ],
  setup (props) {
    const mainStore = useMainStore()
    /*
     * The Vue 2 build registered a Vuex module named after the list and dropped it again. The store
     * registry keeps the same one-per-list identity, and tells us whether this list had one already.
     */
    const listStore = useLogsStore({
      name: props.config.vuexModuleName,
      lsNamespace: 'flespi-toolbox-settings.cols',
      storage: settingsStorage,
      errorHandler: (err) => { mainStore.reqFailed(err) }
    })
    return { mainStore, listStore }
  },
  data () {
    return {
      listItem: markRaw(LogsListItem),
      theme: this.config.theme,
      itemSettings: this.config.itemSettings,
      i18n: {
        'Messages not found': 'Log entries not found'
      },
      scrollTimestamp: undefined,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName,
      actionName: 'getLogs',
      autoscroll: true,
      isInit: false
    }
  },
  computed: {
    messages: {
      get () {
        return this.listStore.messages
      },
      set (val) {
        this.listStore.setMessages(val)
      }
    },
    origin: {
      async set (val) {
        await this.listStore.unsubscribePooling()/* remove subscription for previous active entity */
        this.listStore.setOrigin(val)
        this.listStore.setItemDeletedStatus((this.item && this.item.deleted))
        this.listStore.clearMessages()
        await this.listStore.getCols(this.config.cols)
        await this.listStore.initTime()
        await this.getMessages()
      },
      get () {
        return this.listStore.origin
      }
    },
    panelActions () {
      return [
        {
          label: 'Export CSV',
          icon: 'mdi-file-document-outline',
          handler: () => this.exportCsv(
            {
              filter: `${this.filter}`,
              from: this.from / 1000,
              to: this.to / 1000
            },
            {
              from: this.from,
              to: this.to
            },
            'logs'
          ),
          condition: this.messages.length,
          tooltip: 'Save messages to CSV',
          async: this.isFileCsvLoading
        }
      ]
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
    dateRange () {
      return [this.listStore.from, this.listStore.to]
    },
    from: {
      get () {
        return this.listStore.from
      },
      set (val) {
        val = val || 0
        this.listStore.setFrom(val)
      }
    },
    to: {
      get () {
        return this.listStore.to
      },
      set (val) {
        val = val || 0
        this.listStore.setTo(val)
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
    selected: {
      get () {
        return this.listStore.selected
      },
      set (val) {
        if (val && val.length) { this.autoscroll = false }
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
    realtimeEnabled () {
      return this.listStore.realtimeEnabled
    },
    currentLimit: {
      get () {
        return this.listStore.limit
      },
      set (val) {
        val = val || 1000
        this.listStore.setLimit(val)
      }
    },
    hasNewMessages: {
      get () {
        return this.listStore.hasNewMessages
      },
      set (flag) {
        this.listStore.hasNewMessages = flag
      }
    },
    originByPattern () {
      if (!this.item) { return '' }
      return this.originPattern.replace(/\/:(\w*)(\/)?/g, (match, p1, p2) => {
        return `/${this.item[p1]}${p2 || ''}`
      })
    },
    loadingFlag () {
      return !!this.listStore.isLoading
    },
    needAutoscroll () {
      return this.realtimeEnabled && !this.selected.length && this.autoscroll
    },
    viewConfig () {
      /* merging into `this.config.viewConfig` wrote needKeysProcess into the shared config for good */
      return Object.assign({}, this.config.viewConfig, { needKeysProcess: !!this.selected.length })
    }
  },
  mounted () {
  },
  updated () {
    this.listStore.setItemtype(this.itemtype || null)
  },
  methods: {
    tableClickHandler (event) {
      if (!event.target.closest('.list-item--click-control')) {
        this.selected = []
        this.$emit('view-log-message', [])
      }
    },
    getItemsProps (index, data) {
      const item = this.messages[index]
      data.key = item['x-flespi-message-key']
      data.class = 'list-item list-item--click-control'
      data.props.etcVisible = this.etcVisible
      data.props.actionsVisible = this.actionsVisible
      data.props.itemSettings = this.itemSettings
      data.props.selected = this.selected.includes(index)
      data.props.actions = () => this.getItemPropsActions(item, data)
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.itemClickHandler
      data.dataHandler = (col, row, data) => {
        this.autoscroll = false
        return this.getLogValueOfProp(col.data, row.data)
      }
    },
    getItemPropsActions (item, data) {
      const selectMode = this.selected.length > 1 ? ACTION_MODE_MULTI : ACTION_MODE_SINGLE
      const actions = [...this.config.actions.filter(action => action.mode === selectMode)]
      if (item.error_text && item.traffic) {
        actions.push({
          icon: 'mdi-alert-outline',
          label: 'View error traffic',
          classes: '',
          type: 'to-error-traffic'
        })
      }
      actions.push({
        icon: 'mdi-function',
        label: 'Test expression',
        classes: '',
        type: 'expression'
      })
      return actions
    },
    async getMessages (initTimestamp) {
      if (this.to <= Date.now() || initTimestamp) {
        await this.listStore.get(initTimestamp)
        if (initTimestamp) {
          this.scrollToTimestamp(initTimestamp)
        }
      } else {
        await this.listStore.getHistory(1000)
        this.scrollTo(this.messages.length - 1)
      }
    },
    scrollTo (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollTo(index))
    },
    scrollToWithSavePadding (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollToWithSavePadding(index))
    },
    scrollToTimestamp (timestamp) {
      const scrollIndex = this.messages.findIndex((message) => timestamp <= message.timestamp)
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollTo(scrollIndex))
    },
    scrollHandler ({ event, data }) {
      if (this.isLiveTail(event)) {
        if (this.scrollTimestamp === undefined) { return }
        this.scrollTimestamp = undefined
        this.debouncedUpdateMessagesRoute({}, true)
        return
      }
      const index = Math.floor(data.start + ((data.end - data.start) / 4))
      const message = this.messages[index]
      if (message) {
        const timestamp = message.timestamp
        this.scrollTimestamp = timestamp
        this.debouncedUpdateMessagesRoute({}, true)
      }
    },
    updateSelectedRoute (selected) {
      this.updateMessagesRoute({ selected })
    },
    resetParams () {
      this.$refs.scrollList && this.$refs.scrollList.resetParams()
    },
    processQuery (params) {
      if (!this.isInit) { return false }
      if (params) {
        try {
          params = JSON.parse(params)
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
          if (this.from !== params.from * 1000 || this.to !== params.to * 1000) {
            this.from = params.from * 1000
            this.to = params.to * 1000
            needUpdate = true
          }
          if (needUpdate) {
            this.listStore.clearMessages()
            this.listStore.get().then(() => this.scrollTo(0))
          }
        } catch (e) {}
      }
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.updateMessagesRoute({ filter: val || undefined })
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    timeSync (data) {
      const timestamp = data.content['server.timestamp']
      const from = data.from
      const to = data.to
      this.from = from
      this.to = to
      this.getMessages(timestamp);
    },
    dateRangeChangeHandler (range) {
      const from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.updateMessagesRoute({
        from: from / 1000,
        to: to / 1000
      })
    },
    paginationPrevChangeHandler () {
      this.listStore.getPrevPage()
        .then((count) => {
          if (count && typeof count === 'number') {
            this.scrollToWithSavePadding(count)
          }
        })
    },
    paginationNextChangeHandler () {
      this.listStore.getNextPage()
        .then((count) => {
          this.autoscroll = true
          if (count && typeof count === 'number') {
            this.scrollTo(this.messages.length - count)
          }
        })
    },
    actionHandler ({ index, type, content }) {
      if (this.selected.length > 1) {
        content = this.selected.map(index => this.messages[index])
      }
      switch (type) {
        case 'view': {
          this.itemClickHandler({ index, content })
          break
        }
        case 'copy': {
          this.copyMessageHandler({ index, content })
          break
        }
        case 'traffic': {
          this.$emit('to-traffic', { index, content })
          break
        }
        case 'to-error-traffic': {
          this.$emit('to-error-traffic', { index, content })
          break
        }
        case 'timeSync': {
          this.$emit(`action-${type}`, {
            index,
            content,
            from: this.from,
            to: this.to
          })
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
        case 'error-report': {
          const timestamp = Math.floor(content.timestamp)
          let from = timestamp - 10
          let to = timestamp + 2
          let url = `${window.location.href.split('?')[0]}`
          from = timestamp - 120
          to = timestamp + 2
          url += `?from=${from}&to=${to}&logs=${encodeURI(JSON.stringify({scroll: content.timestamp,selected: [content.timestamp]}))}`
          if (this.entityName === 'channels') {
            if (content.ident) {
              url += `&messages=${encodeURI(JSON.stringify({filter: `ident="${content.ident}"`}))}`
            }
          }
          this.$integrationBus.send('errorReport', {
            data: content,
            description: this.getLogDescriptionByItem(content),
            type: 'log',
            entity: {
              type: this.entityName,
              id: this.item.id
            },
            url
          })
          break
        }
      }
    },
    copyMessageHandler ({ index, content }) {
      copyToClipboard(JSON.stringify(content)).then((e) => {
        this.$q.notify({
          type: 'positive',
          icon: 'content_copy',
          message: 'Log object copied',
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          type: 'negative',
          icon: 'content_copy',
          message: 'Error coping log',
          timeout: 1000
        })
      })
    },
    actionToBottomHandler () {
      if (this.realtimeEnabled) {
        this.autoscroll = true
        this.scrollTo(this.messages.length - 1)
      } else {
        this.listStore.getHistory(1000)
          .then(() => {
            this.scrollTo(this.messages.length - 1)
          })
      }
    },
    async actionToNewMessages () {
      this.hasNewMessages = null
      const now = Date.now(),
        from = new Date(now).setHours(0, 0, 0, 0),
        to = from + 86399999.999
      this.from = from
      this.to = to
      this.listStore.clearMessages()
      this.getMessages()
    },
    actionToNewMessagesHide () {
      this.hasNewMessages = null
    },
    itemClickHandler ({ index, content, event }) {
      this.selected = this.multiselectProcess({index, event, selected: this.selected})
      const messages = this.selected.map(index => this.messages[index])
      this.$emit('view-log-message', messages)
    },
    async changeCid () {
      await this.listStore.unsubscribePooling()/* remove subscription for previous active entity */
      this.listStore.setItemtype(this.itemtype || null)
      this.listStore.setCid(this.cid)
      this.listStore.setItemDeletedStatus(this.item.deleted)
      this.listStore.clearMessages()
      await this.listStore.getCols(this.config.cols)
      await this.listStore.initTime()
      await this.listStore.get()
    },
    unselect () {
      if (this.selected.length) {
        this.selected = []
      }
    },
    nextSelect () {
      if (this.selected.length) {
        const lastIndex = this.selected.slice(-1)[0]
        const newIndex = lastIndex + 1
        this.processSelected(newIndex)
      }
    },
    prevSelect () {
      if (this.selected.length) {
        const firstIndex = this.selected[0]
        const newIndex = firstIndex - 1
        this.processSelected(newIndex)
      }
    },
    processSelected (index) {
      const message = this.messages[index]
      if (message) {
        this.selected = [index]
        const content = message
        Object.defineProperty(content, 'x-flespi-description', {
          value: `<div style="font-size: 1.1rem">${content.event_code}: ${this.getLogDescriptionByItem(content)}</div><div style="font-size: .9rem">${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss (Z)')}</div>`,
          enumerable: false
        })
        Object.defineProperty(content, 'x-flespi-color', {
          value: `text-${this.getLogItemColorByLogEntry(content)}`,
          enumerable: false
        })
        this.$emit('action-select', {
          index: index,
          content: content
        })
        this.scrollTo(index)
      }
    },
    routeConfigProcess (routeConfig = {}) {
      const res = {}
      try {
        routeConfig = JSON.parse(routeConfig)
      } catch (e) {}
      if (routeConfig.filter) { res.filter = routeConfig.filter }
      if (routeConfig.from && routeConfig.to) {
        res.from = routeConfig.from * 1000
        res.to = routeConfig.to * 1000
      } else if (this.$route.query.from && this.$route.query.to) {
        res.from = this.$route.query.from * 1000
        res.to = this.$route.query.to * 1000
      }
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
      if (!this.mainStore.logsObject) {
        await this.mainStore.initLogsObject()
      }
      this.currentLimit = this.limit
      if (this.cid) { this.listStore.setCid(this.cid) }
      if (this.item) {
        let {
          from,
          to,
          filter,
          initTimestamp,
          selected
        } = this.routeConfigProcess(this.$route.query.logs)

        this.filter = filter
        this.listStore.setOrigin(this.originByPattern)
        this.listStore.setItemDeletedStatus((this.item && this.item.deleted))
        await this.listStore.getCols(this.config.cols)
        if (from && to) {
          this.from = from
          this.to = to
          if (initTimestamp) {
            await this.getMessages(initTimestamp)
          } else {
            await this.getMessages()
          }
        } else {
          await this.listStore.initTime()
          await this.getMessages()
        }
        this.initSelectedByTimestamps(selected)
      }
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
        this.$emit('view-log-message', messages)
      }
    },
    updateMessagesRoute (patch = {}, rewrite = false) {
      const messagesParams = {...{
        filter: this.filter || undefined,
        from: this.from / 1000,
        to: this.to / 1000,
        scroll: this.scrollTimestamp,
        selected: this.selectedMessagesTimestamps
      }, ...patch}
      this.updateRoute({  query: { logs: JSON.stringify(messagesParams) } }, rewrite)
    },
    arrowDownHandler () {
      const index = this.selected.slice(-1)[0] + 1
      const content = this.messages[index]
      if (content) {
        const payload = {
          type: 'view',
          content: [content],
          index
        }
        this.actionHandler(payload)
      }
    },
    arrowUpHandler () {
      const index = this.selected[0] - 1
      const content = this.messages[index]
      if (content) {
        const payload = {
          type: 'view',
          content: [content],
          index
        }
        this.actionHandler(payload)
      }
    },
  },
  watch: {
    item (item, prev) {
      if (!prev || (prev && item.id !== prev.id)) {
        this.origin = this.originByPattern
      }
    },
    limit (limit) {
      this.currentLimit = limit
    },
    cid () {
      this.changeCid()
    },

    itemtype () {
      this.changeCid()
    },
    $route (route) {
      this.processRoute({ logs: this.processQuery }, route)
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
        if (this.realtimeEnabled) {
          this.listStore.getMissedMessages()
        }
        this.listStore.clearOfflineState()
      }
    })
  },
  beforeUnmount () {
    this.listStore.unsubscribePooling()
    this.offlineHandler !== undefined && connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && connector.socket.off('connect', this.connectHandler)
    this.listStore.clear()
  },
  mixins: [actions, ItemMixin, routerProcess, testExpressionsMixin, multiselectMixin, liveTail],
  components: {
    VirtualScrollList,
    EmptyPane,
    LogsFilterMenu
  }
}
</script>
