<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :dateRange="dateRange"
      :mode="mode"
      :viewConfig="viewConfig"
      :colsConfigurator="'toolbar'"
      :i18n="i18n"
      :filter="filter"
      :theme="theme"
      :title="'Logs'"
      :loading="loadingFlag"
      @change:filter="filterChangeHandler"
      @scroll:top="paginationPrevChangeHandler"
      @scroll:bottom="paginationNextChangeHandler"
      @change:date-range="dateRangeChangeHandler"
      @change:date-range-prev="dateRangePrevHandler"
      @change:date-range-next="dateRangeNextHandler"
      @change:mode="modeChange"
      @update:cols="updateColsHandler"
      @edit:cols="colsEditHandler"
    >
      <logs-list-item slot="items" slot-scope="{item, index, actions, cols, etcVisible, actionsVisible, itemHeight, rowWidth}"
        :item="item"
        :key="index"
        :index="index"
        :actions="actions"
        :cols="cols"
        :itemHeight="itemHeight"
        :rowWidth="rowWidth"
        :etcVisible="etcVisible"
        :actionsVisible="actionsVisible"
        @action="actionHandler"
        @item-click="viewMessagesHandler"
      />
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, logsModule } from 'qvirtualscroll'
import Vue from 'vue'
import LogsListItem from './LogsListItem.vue'
import EmptyPane from '../EmptyPane'
import { date } from 'quasar'
import filterMessages from '../../mixins/filterMessages'

export default {
  props: [
    'mode',
    'item',
    'cid',
    'limit',
    'originPattern',
    'config'
  ],
  data () {
    return {
      theme: this.config.theme,
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
        let messages = this.$store.state[this.moduleName].messages
        this.setTranslation(messages)
        return messages
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setMessages`, val)
      }
    },
    origin: {
      async set (val) {
        if (this.origin === val) {
          this.$store.commit(`${this.moduleName}/setItemDeletedStatus`, this.item.deleted)
          return false
        }
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active entity */
        this.$store.commit(`${this.moduleName}/setOrigin`, val)
        this.$store.commit(`${this.moduleName}/setItemDeletedStatus`, (this.item && this.item.deleted))
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.$store.dispatch(`${this.moduleName}/getCols`, this.config.cols)
        if (this.$store.state[this.moduleName].mode === 0) {
          await this.$store.dispatch(`${this.moduleName}/initTime`)
          await this.$store.dispatch(`${this.moduleName}/get`)
        } else if (this.$store.state[this.moduleName].mode === 1) {
          await this.$store.dispatch(`${this.moduleName}/pollingGet`)
        }
        if (this.$store.state[this.moduleName].mode === 1 && !this.item.deleted) {
          await this.$store.dispatch(`${this.moduleName}/getHistory`, 200)
        }
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
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setLimit`, val) : this.$store.commit(`${this.moduleName}/setLimit`, 1000)
      }
    },
    originByPattern () {
      if (!this.item) { return '' }
      return this.originPattern.replace(/\/:(\w*)(\/)?/g, (match, p1, p2) => {
        return `/${this.item[p1]}${p2 || ''}`
      })
    },
    loadingFlag () {
      let state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    }
  },
  methods: {
    resetParams () {
      this.$refs.scrollList.resetParams()
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.filter = val
        if (this.mode === 0) {
          this.$store.commit(`${this.moduleName}/clearMessages`)
          this.$store.dispatch(`${this.moduleName}/get`)
        }
      }
    },
    setTranslation (messages) {
      this.i18n.from = messages.length ? `Previous batch until ${date.formatDate(messages[0].timestamp * 1000, 'HH:mm:ss')}` : 'Prev'
      this.i18n.to = messages.length ? `Next batch from ${date.formatDate(messages[messages.length - 1].timestamp * 1000, 'HH:mm:ss')}` : 'Next'
    },
    async modeChange (val) {
      val = +val
      await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active entity */
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.commit(`${this.moduleName}/setMode`, val)
      if (val === 1 && this.origin && this.$store.state[this.moduleName].mode !== null) {
        await this.$store.dispatch(`${this.moduleName}/getHistory`, 200)
        await this.$store.dispatch(`${this.moduleName}/pollingGet`)
      }
      if (val === 0 && this.origin) {
        await this.$store.dispatch(`${this.moduleName}/initTime`) // if need init time by last messages
        await this.$store.dispatch(`${this.moduleName}/get`)
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    dateRangeChangeHandler (range) {
      let from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.from = from
      this.to = to
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/get`)
    },
    dateRangePrevHandler () {
      let delta = this.to - this.from,
        newTo = this.from - 1,
        newFrom = newTo - delta
      this.dateRangeChangeHandler([newFrom, newTo])
    },
    dateRangeNextHandler () {
      let delta = this.to - this.from,
        newFrom = this.to + 1,
        newTo = newFrom + delta
      this.dateRangeChangeHandler([newFrom, newTo])
    },
    paginationPrevChangeHandler () {
      if (this.mode === 0) {
        this.$store.dispatch(`${this.moduleName}/getPrevPage`)
          .then((count) => {
            this.$refs.scrollList.scrollTo(count)
          })
      }
    },
    paginationNextChangeHandler () {
      if (this.mode === 0) {
        this.$store.dispatch(`${this.moduleName}/getNextPage`)
          .then((count) => {
            this.$refs.scrollList.scrollTo(this.messages.length - count)
          })
      }
    },
    actionHandler ({ index, type, content }) {
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({ index, content })
          break
        }
      }
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
      if (this.$store.state[this.moduleName].mode === 0) {
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        await this.$store.dispatch(`${this.moduleName}/get`)
      }
      await this.$store.dispatch(`${this.moduleName}/pollingGet`)
      if (this.$store.state[this.moduleName].mode === 1 && !this.item.deleted) {
        await this.$store.dispatch(`${this.moduleName}/getHistory`, 200)
      }
    },
    colsEditHandler () {
      this.$eventBus.$emit('cols:edit', 'logs')
    }
  },
  watch: {
    item (val) {
      this.origin = this.originByPattern
    },
    mode (mode) {
      this.modeChange(mode)
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
      this.$store.registerModule(this.moduleName, logsModule({ Vue, LocalStorage: this.$q.localStorage, name: this.moduleName, errorHandler: (err) => { this.$store.commit('reqFailed', err) }, filterHandler: this.filterMessages }))
    } else {
      this.$store.commit(`${this.moduleName}/clear`)
    }
    this.currentLimit = this.limit
    if (this.cid) { this.$store.commit(`${this.moduleName}/setCid`, this.cid) }
    if (this.item) {
      this.$store.commit(`${this.moduleName}/setOrigin`, this.originByPattern)
      this.$store.commit(`${this.moduleName}/setItemDeletedStatus`, this.item.deleted)
      this.$store.dispatch(`${this.moduleName}/getCols`, this.config.cols)
    }
    if (this.$store.state[this.moduleName].mode === null) {
      this.modeChange(this.mode)
    }
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`, this.mode === 1)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`, this.mode === 1)
        if (this.mode === 1) {
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
  components: { VirtualScrollList, LogsListItem, EmptyPane }
}
</script>
