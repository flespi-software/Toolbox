<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :class="{'non-selectable': selectionMode}"
      name="IntervalsMessagesVirtualScroll"
      :cols="cols"
      :actions="actions"
      :panelActions="panelActions"
      :items="messages"
      :dateRange="dateRange"
      :viewConfig="viewConfig"
      :filter="filter"
      :theme="theme"
      :title="'Messages'"
      :loading="loadingFlag"
      :autoscroll="needAutoscroll"
      :i18n="i18n"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      @click.native="tableClickHandler"
      @scroll="scrollHandler"
      @action="actionHandler"
      @change-filter="filterChangeHandler"
      @scroll-top="paginationPrevChangeHandler"
      @scroll-bottom="paginationNextChangeHandler"
      @action-to-bottom="actionToBottomHandler"
      @update-cols="updateColsHandler"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, devicesMessagesModule } from 'qvirtualscroll'
import Vue from 'vue'
import debounce from 'lodash/debounce'
import actions from '../../mixins/actions'
import { copyToClipboard } from 'quasar'
import EmptyPane from '../EmptyPane'
import MessagesListItem from './DevicesMessagesListItem.vue'
import routerProcess from '../../mixins/routerProcess'
import { ACTION_MODE_MULTI, ACTION_MODE_SINGLE } from '../../config'
import testExpressionsMixin from '../../mixins/testExpressionsMixin'
import multiselectMixin from '../../mixins/multiselectMixin'

export default {
  props: [
    'item',
    'activeId',
    'interval',
    'dateRange',
    'limit',
    'config'
  ],
  data () {
    return {
      listItem: MessagesListItem,
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      autoscroll: true,
      scrollTimestamp: undefined,
      moduleName: this.config.vuexModuleName,
      isInit: false,
      i18n: {
        'Columns by schema': 'Columns by protocol'
      }
    }
  },
  computed: {
    messages: {
      get () {
        const messages = this.$store.state[this.moduleName].messages
        this.scrollControlling(messages.length)
        return messages
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setMessages`, val)
      }
    },
    intervals () {
      return this.$store.state[this.moduleName].messages
    },
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (val) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active device */
        this.$store.commit(`${this.moduleName}/setActive`, val)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        await this.$store.dispatch(`${this.moduleName}/getCols`, { etc: true })
        await this.getMessages()
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
    from: {
      get () {
        return this.$store.state[this.moduleName].from
      },
      set (val) {
        val = val || 0
        this.$store.commit(`${this.moduleName}/setFrom`, val)
      }
    },
    to: {
      get () {
        return this.$store.state[this.moduleName].to
      },
      set (val) {
        val = val || 0
        this.$store.commit(`${this.moduleName}/setTo`, val)
      }
    },
    realtimeEnabled () {
      return this.$store.state[this.moduleName].realtimeEnabled
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
        val = val || 1000
        this.$store.commit(`${this.moduleName}/setLimit`, val)
      }
    },
    selected: {
      get () {
        return this.$store.state[this.moduleName].selected
      },
      set (val) {
        if (val && val.length) { this.autoscroll = false }
        this.$store.commit(`${this.moduleName}/setSelected`, val)
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
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    },
    needAutoscroll () {
      return this.realtimeEnabled && !this.selected.length && this.autoscroll
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
            'devices'
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
      data.props.highlighted = this.interval && item.timestamp >= this.interval.begin && item.timestamp <= this.interval.end
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.itemClickHandler
      data.dataHandler = (col, row, data) => {
        this.autoscroll = false
        return this.listItem.methods.getValueOfProp(col.data, row.data)
      }
    },
    getItemPropsActions (item, data) {
      const selectMode = this.selected.length > 1 ? ACTION_MODE_MULTI : ACTION_MODE_SINGLE
      const actions = [...this.config.actions.filter(action => action.mode === selectMode)]
      if (selectMode === ACTION_MODE_SINGLE) {
        if (item['position.latitude'] && item['position.longitude']) {
          actions.push({
            icon: 'mdi-map',
            label: 'Show on map',
            classes: '',
            type: 'map'
          })
        }
        Object.keys(item).some(name => {
          const hasImage = item[name] &&
            (item[name].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/) ||
            name.indexOf('image.bin.') === 0)
          if (hasImage) {
            actions.push({
              icon: 'mdi-image-outline',
              label: 'Show image',
              classes: '',
              type: 'image'
            })
          }
          return hasImage
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
    scrollTo (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollTo(index))
    },
    scrollToWithSavePadding (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollToWithSavePadding(index))
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
    async getMessages () {
      if (this.to <= Date.now()) {
        await this.$store.dispatch(`${this.moduleName}/get`)
      } else {
        await this.$store.dispatch(`${this.moduleName}/getHistory`, 1000)
        this.scrollTo(this.messages.length - 1)
      }
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
          this.getMessages()
        }
      } catch (e) {}
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.updateMessagesRoute({ filter: val || undefined })
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    dateRangeChangeHandler (range) {
      const from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.from = from
      this.to = to
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.getMessages()
    },
    paginationPrevChangeHandler () {
      this.$store.dispatch(`${this.moduleName}/getPrevPage`)
        .then((count) => {
          if (count && typeof count === 'number') {
            this.scrollToWithSavePadding(count)
          }
        })
    },
    paginationNextChangeHandler () {
      this.$store.dispatch(`${this.moduleName}/getNextPage`)
        .then((count) => {
          this.autoscroll = true
          if (count && typeof count === 'number') {
            this.scrollTo(this.messages.length - count)
          }
        })
    },
    async showMessagesByInterval () {
      const interval = this.interval
      if (!interval) { return }
      const existMessageIndex = this.messages.findIndex(message => message.timestamp === interval.begin)
      if (existMessageIndex !== -1) {
        this.scrollTo(existMessageIndex - 1)
      } else {
        this.$store.state[this.moduleName].messages = []
        const intervalMessages = await this.$store.dispatch(`${this.moduleName}/getMessages`, { from: interval.begin, to: interval.end, count: this.limit })
        const count = Math.ceil((this.limit - intervalMessages.length) / 2)
        let scrollToIndex = 0
        if (intervalMessages.length < this.limit) {
          const paddingMessages = await Promise.all([
            this.$store.dispatch(`${this.moduleName}/getMessages`, { from: this.from / 1000, to: interval.begin - 0.000001, count, reverse: true }),
            this.$store.dispatch(`${this.moduleName}/getMessages`, { from: interval.end + 0.000001, to: this.to / 1000, count })
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
        this.$store.state[this.moduleName].pages = [intervalMessages.length]
        this.$store.commit(`${this.moduleName}/setHistoryMessages`, intervalMessages)
        this.scrollTo(scrollToIndex)
      }
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
        case 'expression': {
          this.showExprTest(
            this.$store.state.token,
            this.cols.schemas[this.cols.activeSchema].cols,
            this.selected.map(index => this.messages[index])
          )
          break
        }
        default: {
          this.$emit(`action-${type}`, { index, content: [content] })
          break
        }
      }
    },
    itemClickHandler ({ index, content, event }) {
      this.selected = this.multiselectProcess({index, event, selected: this.selected})
      const messages = this.selected.map(index => this.messages[index])
      this.$emit('action-view-data', { index, content: messages })
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
    actionToBottomHandler () {
      if (this.realtimeEnabled) {
        this.autoscroll = true
        this.scrollTo(this.messages.length - 1)
      } else {
        this.$store.dispatch(`${this.moduleName}/getHistory`, 1000)
          .then(() => {
            this.scrollTo(this.messages.length - 1)
          })
      }
    },
    unselect () {
      if (this.selected.length) {
        this.selected = []
      }
    },
    scrollControlling (count) {
      if (this.selected.length && this.selected[0] + 1000 <= count) {
        this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
      }
    },
    nextSelect () {
      if (this.selected.length) {
        const lastIndex = this.selected.slice(-1)[0]
        const newIndex = lastIndex + 1
        const message = this.messages[newIndex]
        if (message) {
          this.selected = [newIndex]
          this.$emit('action-select', {
            index: newIndex,
            content: [message]
          })
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
          this.$emit('action-select', {
            index: newIndex,
            content: [message]
          })
          this.scrollTo(newIndex)
        }
      }
    },
    async getMessagesStartedBy (startTimestamp) {
      startTimestamp = startTimestamp * 1000
      const currentMessagesParams = {
        from: startTimestamp / 1000,
        to: startTimestamp / 1000,
        filter: this.filter || undefined,
        count: this.currentLimit
      }
      const currentMessages = await this.$store.dispatch(`${this.moduleName}/getMessages`, currentMessagesParams)
      const beforeMessagesParams = {
        from: this.from / 1000,
        to: (startTimestamp - 0.001) / 1000,
        reverse: true,
        filter: this.filter || undefined,
        count: (this.currentLimit / 2) - currentMessages.length
      }
      const afterMessagesParams = {
        from: (startTimestamp + 0.001) / 1000,
        to: this.to / 1000,
        filter: this.filter || undefined,
        count: (this.currentLimit / 2) - currentMessages.length
      }
      const beforeMessages = await this.$store.dispatch(`${this.moduleName}/getMessages`, beforeMessagesParams)
      const afterMessages = await this.$store.dispatch(`${this.moduleName}/getMessages`, afterMessagesParams)
      const messages = [...beforeMessages.reverse(), ...currentMessages, ...afterMessages]
      this.$store.commit(`${this.moduleName}/limiting`, { type: 'init', count: messages.length })
      this.$store.commit(`${this.moduleName}/setHistoryMessages`, messages)
      const scrollIndex = beforeMessages.length
      this.scrollTo(scrollIndex)
    },
    routeConfigProcess (routeConfig = {}) {
      const res = {
        needInitMessages: true
      }
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
      if (this.$route.query.intervals && this.$route.query.intervals.indexOf('selected') !== -1) {
        res.needInitMessages = false
      }
      return res
    },
    async init () {
      if (!this.$store.state[this.moduleName]) {
        this.$store.registerModule(this.moduleName, devicesMessagesModule({ Vue, LocalStorage: this.$q.localStorage, name: { name: this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' }, errorHandler: (err) => { this.$store.commit('reqFailed', err) } }))
      } else {
        this.$store.commit(`${this.moduleName}/clear`)
      }
      this.$store.commit(`${this.moduleName}/setSortBy`, 'timestamp')
      this.currentLimit = this.limit
      let {
        filter,
        initTimestamp,
        selected,
        needInitMessages
      } = this.routeConfigProcess(this.$route.query.messages)

      this.filter = filter
      this.dateRangeChangeHandler(this.dateRange)
      this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
      await this.$store.dispatch(`${this.moduleName}/getCols`, { etc: true })

      if (needInitMessages) {
        if (initTimestamp) {
        await this.getMessagesStartedBy(initTimestamp)
      } else {
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
        this.$emit('action-view-data', { index: indexes[indexes.length - 1], content: messages })
      }
    },
    updateMessagesRoute (patch = {}, rewrite = false) {
      const messagesParams = {...{
        filter: this.filter || undefined,
        scroll: this.scrollTimestamp,
        selected: this.selectedMessagesTimestamps
      }, ...patch}
      this.updateRoute({  query: { messages: JSON.stringify(messagesParams) } }, rewrite)
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    },
    limit (limit) {
      this.currentLimit = limit
    },
    dateRange (date) {
      this.dateRangeChangeHandler(date)
    },
    interval () {
      this.showMessagesByInterval()
    },
    $route (route) {
      this.processRoute({
        messages: this.processQuery,
      }, route)
    }
  },
  created () {
    this.debouncedUpdateMessagesRoute = debounce(this.updateMessagesRoute, 500, { trailing: true, maxWait: 1000 })
    this.init()
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`)
        if (this.realtimeEnabled) {
          this.$store.dispatch(`${this.moduleName}/getMissedMessages`)
        }
        this.$store.commit(`${this.moduleName}/clearOfflineState`)
      }
    })
  },
  beforeDestroy () {
    this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
    this.offlineHandler !== undefined && Vue.connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && Vue.connector.socket.off('connect', this.connectHandler)
    this.$store.commit(`${this.moduleName}/clear`)
  },
  mixins: [actions, routerProcess, testExpressionsMixin, multiselectMixin],
  components: { VirtualScrollList, EmptyPane }
}
</script>
