<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :dateRange="[begin, end]"
      :viewConfig="viewConfig"
      :filter="filter"
      :theme="theme"
      :title="'Intervals'"
      :loading="loadingFlag"
      :autoscroll="needAutoscroll"
      scrollOffset="10%"
      :item="listItem"
      :itemprops="getItemsProps"
      @change-filter="filterChangeHandler"
      @change-date-range="dateRangeChangeHandler"
      @update-cols="updateColsHandler"
      @action-to-bottom="actionToBottomHandler"
      @to-default-cols="toDefaultColsHandler"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, intervalsModule } from 'qvirtualscroll'
import Vue from 'vue'
import { copyToClipboard } from 'quasar'
import filterMessages from '../../mixins/filterMessages'
import MessagesListItem from './MessagesListItem.vue'
import EmptyPane from '../EmptyPane'

export default {
  props: [
    'item',
    'activeId',
    'activeDeviceId',
    'limit',
    'config'
  ],
  data () {
    return {
      listItem: MessagesListItem,
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      moduleName: this.config.vuexModuleName,
      autoscroll: true,
      viewedInterval: null
    }
  },
  computed: {
    actions () {
      const initActions = this.config.actions,
        routeFields = this.getRouteFields()
      let actions = [initActions[0]]
      if (routeFields && routeFields.length) {
        actions = initActions
      }
      return actions
    },
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
        val && this.$store.dispatch(`${this.moduleName}/getCols`, this.item.counters)
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
        val ? this.$store.commit(`${this.moduleName}/setFilter`, val) : this.$store.commit(`${this.moduleName}/setFilter`, '')
      }
    },
    begin: {
      get () {
        return this.$store.state[this.moduleName].begin
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setBegin`, val) : this.$store.commit(`${this.moduleName}/setBegin`, 0)
      }
    },
    end: {
      get () {
        return this.$store.state[this.moduleName].end
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setEnd`, val) : this.$store.commit(`${this.moduleName}/setEnd`, 0)
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
        val ? this.$store.commit(`${this.moduleName}/setLimit`, val) : this.$store.commit(`${this.moduleName}/setLimit`, 0)
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
    routesFileds () {
      return this.getRouteFields()
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    },
    needAutoscroll () {
      return !this.selected.length && this.autoscroll
    }
  },
  methods: {
    getItemsProps (index, data) {
      const item = this.messages[index]
      data.key = item['x-flespi-message-key']
      data.props.etcVisible = this.etcVisible
      data.props.actionsVisible = this.actionsVisible
      data.props.selected = this.selected.includes(index)
      data.props.highlighted = this.viewedInterval && item.id === this.viewedInterval.id
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessagesAndShowInMessagesHandler
      data.dataHandler = (col, row, data) => {
        this.autoscroll = false
        return this.listItem.methods.getValueOfProp(col.data, row.data)
      }
    },
    resetParams () {
      this.$refs.scrollList.resetParams()
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.filter = val
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.$store.dispatch(`${this.moduleName}/get`)
      }
    },
    getRouteFields () {
      return this.item.counters && this.item.counters.filter((counter) => {
        return counter.type === 'route'
      })
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    dateRangeChangeHandler (range) {
      const begin = range[0],
        end = range[1]
      if (this.begin === begin && this.end === end) { return false }
      this.begin = begin
      this.end = end
      this.$emit('change:date-range', range)
      this.viewedInterval = null
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/get`)
    },
    actionHandler ({ index, type, content }) {
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({ index, content })
          break
        }
        case 'map': {
          this.onMapHandler({ index, content })
          break
        }
        case 'copy': {
          this.copyMessageHandler({ index, content })
          break
        }
      }
    },
    actionToBottomHandler () {
      this.autoscroll = true
      this.$refs.scrollList.scrollTo(this.messages.length - 1)
    },
    viewMessagesAndShowInMessagesHandler ({ index, content }) {
      this.viewMessagesHandler({ index, content })
      this.inMessagesHandler({ index, content })
    },
    viewMessagesHandler ({ index, content }) {
      this.selected = [index]
      this.$emit('view-data', content)
    },
    onMapHandler ({ index, content }) {
      const routes = Object.keys(content).reduce((routes, fieldName) => {
        if (this.routesFileds.filter(field => field.name === fieldName).length) {
          routes.push(content[fieldName])
        }
        return routes
      }, [])
      this.$emit('on-map', routes)
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
        const message = messages[selectedIndex]
        this.viewMessagesHandler({ index: selectedIndex, content: message })
      }
    },
    toDefaultColsHandler () {
      this.$store.commit(`${this.moduleName}/setDefaultCols`)
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
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(this.moduleName, intervalsModule({ Vue, LocalStorage: this.$q.localStorage, name: { name: this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' }, errorHandler: (err) => { this.$store.commit('reqFailed', err) }, filterHandler: this.filterMessages }))
    } else {
      this.$store.commit(`${this.moduleName}/clear`)
    }
    this.currentLimit = this.limit
    if (this.activeId) {
      this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
      this.$store.dispatch(`${this.moduleName}/getCols`, this.item.counters)
    }
    if (this.activeDeviceId) {
      this.$store.commit(`${this.moduleName}/setActiveDevice`, this.activeDeviceId)
    }
    this.$store.dispatch(`${this.moduleName}/initTime`)
      .then(() => {
        this.$emit('change:date-range', [this.begin, this.end])
        this.$store.dispatch(`${this.moduleName}/get`)
        this.$store.dispatch(`${this.moduleName}/pollingGet`)
      })
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`, true)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`, true)
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
  mixins: [filterMessages],
  components: { VirtualScrollList, EmptyPane }
}
</script>
