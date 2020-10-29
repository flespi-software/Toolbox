<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :dateRange="dateRange"
      :viewConfig="viewConfig"
      :colsConfigurator="'toolbar'"
      :filter="filter"
      :theme="theme"
      :title="'Messages'"
      :loading="loadingFlag"
      :autoscroll="realtimeEnabled"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      @change:filter="filterChangeHandler"
      @scroll:top="paginationPrevChangeHandler"
      @scroll:bottom="paginationNextChangeHandler"
      @action:to-bottom="actionToBottomHandler"
      @update:cols="updateColsHandler"
      @edit:cols="colsEditHandler"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, devicesMessagesModule } from 'qvirtualscroll'
import Vue from 'vue'
import { copyToClipboard } from 'quasar'
import filterMessages from '../../mixins/filterMessages'
import EmptyPane from '../EmptyPane'
import MessagesListItem from './DevicesMessagesListItem.vue'

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
      moduleName: this.config.vuexModuleName
    }
  },
  computed: {
    messages: {
      get () {
        return this.$store.state[this.moduleName].messages
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
        await this.$store.dispatch(`${this.moduleName}/getCols`, { actions: true, etc: true })
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
        val ? this.$store.commit(`${this.moduleName}/setFilter`, val) : this.$store.commit(`${this.moduleName}/setFilter`, '')
      }
    },
    from: {
      get () {
        return this.$store.state[this.moduleName].from
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setFrom`, val) : this.$store.commit(`${this.moduleName}/setFrom`, 0)
      }
    },
    to: {
      get () {
        return this.$store.state[this.moduleName].to
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setTo`, val) : this.$store.commit(`${this.moduleName}/setTo`, 0)
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
        val ? this.$store.commit(`${this.moduleName}/setLimit`, val) : this.$store.commit(`${this.moduleName}/setLimit`, 1000)
      }
    },
    selected: {
      get () {
        return this.$store.state[this.moduleName].selected
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setSelected`, val)
      }
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    }
  },
  methods: {
    getItemsProps (index, data) {
      const item = this.messages[index]
      data.key = item['x-flespi-message-key']
      data.props.etcVisible = this.etcVisible
      data.props.actionsVisible = this.actionsVisible
      data.props.selected = this.selected.includes(index)
      const itemTimestamp = Math.floor(item.timestamp)
      data.props.highlighted = this.interval && itemTimestamp >= this.interval.begin && itemTimestamp <= this.interval.end
      if (item['position.latitude'] && item['position.longitude']) {
        data.props.actions = [
          ...data.props.actions,
          {
            icon: 'mdi-map',
            label: 'show on map',
            classes: '',
            type: 'map'
          }
        ]
      }
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessagesHandler
    },
    scrollTo (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollTo(index))
    },
    scrollToWithSavePadding (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollToWithSavePadding(index))
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
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.filter = val
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.getMessages()
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
            this.$store.dispatch(`${this.moduleName}/getMessages`, { from: Math.floor(this.from / 1000), to: interval.begin - 1, count, reverse: true }),
            this.$store.dispatch(`${this.moduleName}/getMessages`, { from: interval.end + 1, to: Math.floor(this.to / 1000), count })
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
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({ index, content })
          break
        }
        case 'copy': {
          this.copyMessageHandler({ index, content })
          break
        }
        case 'map': {
          this.onMapHandler({ index, content })
          break
        }
      }
    },
    onMapHandler ({ index, content }) {
      this.$emit('on-map', { index, content })
    },
    viewMessagesHandler ({ index, content }) {
      this.selected = [index]
      this.$emit('view-data', content)
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
    colsEditHandler () {
      this.$eventBus.$emit('cols:edit', 'messages')
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
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(this.moduleName, devicesMessagesModule({ Vue, LocalStorage: this.$q.localStorage, name: { name: this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' }, errorHandler: (err) => { this.$store.commit('reqFailed', err) }, filterHandler: this.filterMessages }))
    } else {
      this.$store.commit(`${this.moduleName}/clear`)
    }
    this.currentLimit = this.limit
    if (this.activeId) { this.active = this.activeId }
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`, this.realtimeEnabled)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`, this.realtimeEnabled)
        if (this.realtimeEnabled) {
          this.$store.dispatch(`${this.moduleName}/getMissedMessages`)
        }
      }
    })
  },
  beforeDestroy () {
    this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
    this.offlineHandler !== undefined && Vue.connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && Vue.connector.socket.off('connect', this.connectHandler)
    this.$store.commit(`${this.moduleName}/clear`)
  },
  mixins: [filterMessages],
  components: { VirtualScrollList, EmptyPane }
}
</script>
