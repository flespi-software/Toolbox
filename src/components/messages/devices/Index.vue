<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :dateRange="dateRange"
      :viewConfig="viewConfig"
      :filter="filter"
      :theme="theme"
      :title="'Messages'"
      :loading="loadingFlag"
      :autoscroll="needAutoscroll"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      :has-new-messages="hasNewMessages"
      @change-filter="filterChangeHandler"
      @scroll-top="paginationPrevChangeHandler"
      @scroll-bottom="paginationNextChangeHandler"
      @change-date-range="dateRangeChangeHandler"
      @action-to-bottom="actionToBottomHandler"
      @update-cols="updateColsHandler"
      @action-to-new-messages="actionToNewMessages"
      @action-to-new-messages-hide="actionToNewMessagesHide"
      @to-default-cols="toDefaultColsHandler"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, devicesMessagesModule } from 'qvirtualscroll'
import Vue from 'vue'
import { copyToClipboard } from 'quasar'
import filterMessages from '../../../mixins/filterMessages'
import EmptyPane from '../../EmptyPane'
import MessagesListItem from './MessagesListItem.vue'

export default {
  props: [
    'item',
    'activeId',
    'limit',
    'config'
  ],
  data () {
    return {
      listItem: MessagesListItem,
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName,
      autoscroll: true
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
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (val) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active device */
        this.$store.commit(`${this.moduleName}/setActive`, val)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        await this.$store.dispatch(`${this.moduleName}/getCols`, { actions: true, etc: true })
        await this.$store.dispatch(`${this.moduleName}/initTime`)
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
    dateRange () {
      return [this.$store.state[this.moduleName].from, this.$store.state[this.moduleName].to]
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
        if (val && val.length) { this.autoscroll = false }
        this.$store.commit(`${this.moduleName}/setSelected`, val)
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
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    },
    needAutoscroll () {
      return this.realtimeEnabled && !this.selected.length && this.autoscroll
    }
  },
  methods: {
    getItemsProps (index, data) {
      const item = this.messages[index]
      data.key = item['x-flespi-message-key']
      data.props.etcVisible = this.etcVisible
      data.props.actionsVisible = this.actionsVisible
      data.props.selected = this.selected.includes(index)
      if (item['position.latitude'] && item['position.longitude']) {
        data.props.actions = [
          ...data.props.actions,
          {
            icon: 'mdi-map',
            label: 'Show on map',
            classes: '',
            type: 'map'
          }
        ]
      }
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessagesHandler
      data.dataHandler = (col, row, data) => {
        this.autoscroll = false
        return this.listItem.methods.getValueOfProp(col.data, row.data)
      }
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
          this.autoscroll = true
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
    viewMessagesHandler ({ index, content }) {
      this.selected = [index]
      this.$emit('view-data', content)
    },
    onMapHandler ({ index, content }) {
      this.$emit('on-map', { index, content })
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
    unselect () {
      if (this.selected.length) {
        this.selected = []
      }
    },
    toDefaultColsHandler () {
      this.$store.commit(`${this.moduleName}/setDefaultCols`)
    },
    scrollControlling (count) {
      if (this.selected.length && this.selected[0] + 1000 <= count) {
        this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
      }
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    },
    limit (limit) {
      this.currentLimit = limit
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
