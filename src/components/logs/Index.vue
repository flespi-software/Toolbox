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
      :i18n="i18n"
      :filter="filter"
      :theme="theme"
      :title="'Logs'"
      :loading="loadingFlag"
      :autoscroll="realtimeEnabled"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      :has-new-messages="hasNewMessages"
      @change:filter="filterChangeHandler"
      @scroll:top="paginationPrevChangeHandler"
      @scroll:bottom="paginationNextChangeHandler"
      @change:date-range="dateRangeChangeHandler"
      @action:to-bottom="actionToBottomHandler"
      @action:to-new-messages="actionToNewMessages"
      @action:to-new-messages-hide="actionToNewMessagesHide"
      @update:cols="updateColsHandler"
      @edit:cols="colsEditHandler"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, logsModule } from 'qvirtualscroll'
import Vue from 'vue'
import LogsListItem from './LogsListItem.vue'
import EmptyPane from '../EmptyPane'
import filterMessages from '../../mixins/filterMessages'

export default {
  props: [
    'item',
    'cid',
    'limit',
    'originPattern',
    'config'
  ],
  data () {
    return {
      listItem: LogsListItem,
      theme: this.config.theme,
      itemSettings: this.config.itemSettings,
      i18n: {
        'Messages not found': 'Log entries not found'
      },
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
    origin: {
      async set (val) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active entity */
        this.$store.commit(`${this.moduleName}/setOrigin`, val)
        this.$store.commit(`${this.moduleName}/setItemDeletedStatus`, (this.item && this.item.deleted))
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.$store.dispatch(`${this.moduleName}/getCols`, this.config.cols)
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        await this.getMessages()
      },
      get () {
        return this.$store.state[this.moduleName].origin
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
    dateRange () {
      return [this.$store.state[this.moduleName].from, this.$store.state[this.moduleName].to]
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
    reverse: {
      get () {
        return this.$store.state[this.moduleName].reverse || false
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setReverse`, val)
      }
    },
    realtimeEnabled () {
      return this.$store.state[this.moduleName].realtimeEnabled
    },
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setLimit`, val) : this.$store.commit(`${this.moduleName}/setLimit`, 1000)
      }
    },
    hasNewMessages: {
      get () {
        return this.$store.state[this.moduleName].hasNewMessages
      },
      set (flag) {
        this.$store.state[this.moduleName].hasNewMessages = flag
      }
    },
    originByPattern () {
      if (!this.item) { return '' }
      return this.originPattern.replace(/\/:(\w*)(\/)?/g, (match, p1, p2) => {
        return `/${this.item[p1]}${p2 || ''}`
      })
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
      data.props.itemSettings = this.itemSettings
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessagesHandler
    },
    async getMessages () {
      if (this.to <= Date.now()) {
        await this.$store.dispatch(`${this.moduleName}/get`)
      } else {
        await this.$store.dispatch(`${this.moduleName}/getHistory`, 1000)
        this.scrollTo(this.messages.length - 1)
      }
    },
    scrollTo (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollTo(index))
    },
    scrollToWithSavePadding (index) {
      this.$nextTick(() => this.$refs.scrollList && this.$refs.scrollList.scrollToWithSavePadding(index))
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
      this.$store.dispatch(`${this.moduleName}/get`).then(() => this.scrollTo(0))
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
    actionHandler ({ index, type, content }) {
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({ index, content })
          break
        }
        case 'traffic': {
          this.$emit('to-traffic', { index, content })
          break
        }
      }
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
    async actionToNewMessages () {
      this.hasNewMessages = null
      const now = Date.now(),
        from = new Date(now).setHours(0, 0, 0, 0),
        to = from + 86399999
      this.from = from
      this.to = to
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.getMessages()
    },
    actionToNewMessagesHide () {
      this.hasNewMessages = null
    },
    viewMessagesHandler ({ index, content }) {
      this.$emit('view-log-message', content)
    },
    async changeCid () {
      await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active entity */
      this.$store.commit(`${this.moduleName}/setCid`, this.cid)
      this.$store.commit(`${this.moduleName}/setItemDeletedStatus`, this.item.deleted)
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/getCols`, this.config.cols)
      await this.$store.dispatch(`${this.moduleName}/initTime`)
      await this.$store.dispatch(`${this.moduleName}/get`)
    },
    colsEditHandler () {
      this.$eventBus.$emit('cols:edit', 'logs')
    }
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
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(this.moduleName, logsModule({ Vue, LocalStorage: this.$q.localStorage, name: { name: this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' }, errorHandler: (err) => { this.$store.commit('reqFailed', err) }, filterHandler: this.filterMessages }))
    } else {
      this.$store.commit(`${this.moduleName}/clear`)
    }
    this.currentLimit = this.limit
    if (this.cid) { this.$store.commit(`${this.moduleName}/setCid`, this.cid) }
    if (this.item) {
      this.origin = this.originByPattern
    }
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
