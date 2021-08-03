<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="config.actions"
      :panelActions="panelActions"
      :items="messages"
      :dateRange="dateRange"
      :viewConfig="config.viewConfig"
      :filter="filter"
      :theme="config.theme"
      :title="'Messages'"
      :loading="loadingFlag"
      :autoscroll="needAutoscroll"
      scrollOffset="10%"
      :i18n="i18n"
      :item="listItem"
      :itemprops="getItemsProps"
      :has-new-messages="hasNewMessages"
      @action="actionHandler"
      @change-filter="filterChangeHandler"
      @scroll-top="paginationPrevChangeHandler"
      @scroll-bottom="paginationNextChangeHandler"
      @change-date-range="dateRangeChangeHandler"
      @update-cols="updateColsHandler"
      @action-to-bottom="actionToBottomHandler"
      @action-to-new-messages="actionToNewMessages"
      @action-to-new-messages-hide="actionToNewMessagesHide"
    >
      <empty-pane slot="empty" :config="config.emptyState"/>
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, channelsMessagesModuleSerial } from 'qvirtualscroll'
import Vue from 'vue'
import { copyToClipboard } from 'quasar'
import MessagesListItem from './MessagesListItem.vue'
import EmptyPane from '../../EmptyPane'
import get from 'lodash/get'
import actions from '../../../mixins/actions'

export default {
  props: [
    'item',
    'activeId',
    'limit',
    'config',
    'needRestoreSettings'
  ],
  data () {
    return {
      listItem: MessagesListItem,
      moduleName: this.config.vuexModuleName,
      autoscroll: true,
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
    panelActions () {
      return [
        {
          label: 'Export CSV',
          icon: 'mdi-file-document-outline',
          handler: this.exportCsv,
          condition: this.messages.length,
          tooltip: 'Save messages to CSV',
          async: this.isFileCsvLoading
        }
      ]
    },
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (val) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active device */
        this.$store.commit(`${this.moduleName}/setActive`, val)
        const activeItem = this.$store.state.channels[val] || {}
        this.$set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        this.$store.commit(`${this.moduleName}/clearMessages`)
        await this.$store.dispatch(`${this.moduleName}/getCols`, { etc: false })
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
    dateRange () {
      return [this.$store.state[this.moduleName].from, this.$store.state[this.moduleName].to]
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
    hasNewMessages: {
      get () {
        return this.$store.state[this.moduleName].hasNewMessages
      },
      set (flag) {
        this.$store.state[this.moduleName].hasNewMessages = flag
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
      Object.keys(item).some(name => {
        const hasImage = item[name] &&
          (item[name].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/) ||
          name.indexOf('image.bin.') === 0)
        if (hasImage) {
          data.props.actions = [
            ...data.props.actions,
            {
              icon: 'mdi-image-outline',
              label: 'Show image',
              classes: '',
              type: 'image'
            }
          ]
        }
        return hasImage
      })
      if (!data.on) { data.on = {} }
      data.on.action = this.actionHandler
      data.on['item-click'] = this.viewMessagesHandler
      data.dataHandler = (col, row, data) => {
        this.autoscroll = false
        return this.listItem.methods.getValueOfProp(col.data, row.data)
      }
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
        if (this.realtimeEnabled) { this.$store.dispatch(`${this.moduleName}/unsubscribePooling`) }
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
      this.selected = [index]
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({ index, content })
          break
        }
        case 'copy': {
          this.copyMessageHandler({ index, content })
          break
        }
        default: {
          this.$emit(`action-${type}`, { index, content })
          break
        }
      }
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
    viewMessagesHandler ({ index, content }) {
      this.selected = [index]
      this.$emit('action-view-data', { index, content })
    },
    // itemClickHandler ({ index, content, event }) {
    //   if (event.shiftKey) {
    //     if (this.selected[0]) {
    //       if (this.selected[0] > index) {
    //         this.selected = range(index, this.selected[0] + 1)
    //       } else {
    //         this.selected = range(this.selected[0], index + 1)
    //       }
    //     } else {
    //       this.selected = [index]
    //     }
    //   } else if (event.ctrlKey || event.metaKey) {
    //     if (this.selected.includes(index)) {
    //       const selected = this.selected
    //       selected.splice(this.selected.indexOf(index), 1)
    //       this.selected = selected
    //     } else {
    //       this.selected = [...this.selected, index]
    //     }
    //   } else {
    //     this.selected = [index]
    //   }
    //   const messages = this.messages.reduce((messages, message, index) => {
    //     const includes = this.selected.includes(index)
    //     if (includes) {
    //       const modifiedMessage = Object.keys(message).reduce((result, key) => {
    //         if (key.indexOf('x-flespi') !== -1) {
    //           return result
    //         }
    //         result[key] = message[key]
    //         return result
    //       }, {})
    //       messages.push(modifiedMessage)
    //     }
    //     return messages
    //   }, [])
    //   this.$emit('action-view-data', { index, content: messages })
    // },
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
    clearMessage (message) {
      return Object.keys(message).reduce((result, key) => {
        if (key.indexOf('x-flespi') !== -1) {
          return result
        }
        result[key] = message[key]
        return result
      }, {})
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
        const message = this.messages[newIndex]
        if (message) {
          this.selected = [newIndex]
          this.$emit('action-select', {
            index: newIndex,
            content: this.clearMessage(message)
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
            content: this.clearMessage(message)
          })
          this.scrollTo(newIndex)
        }
      }
    },
    scrollControlling (count) {
      if (this.selected.length && this.selected[0] + 1000 <= count) {
        this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
      }
    },
    async init () {
      if (!this.$store.state[this.moduleName]) {
        this.$store.registerModule(this.moduleName, channelsMessagesModuleSerial({ Vue, LocalStorage: this.$q.localStorage, name: { name: this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' }, errorHandler: (err) => { this.$store.commit('reqFailed', err) } }))
      } else {
        this.$store.commit(`${this.moduleName}/clear`)
      }
      this.currentLimit = this.limit
      let filter = get(this.$store.state.sessionSettings, 'savedFilter', '')
      if (filter) {
        if (this.needRestoreSettings) {
          filter = get(filter, `channels.${this.activeId}`, '')
          this.filter = filter
        }
        this.$store.commit('setToolboxSessionSettings', { savedFilter: undefined })
      }
      if (this.activeId) {
        const from = this.$route.query.from * 1000,
          to = this.$route.query.to * 1000
        this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
        const activeItem = this.$store.state.channels[this.activeId] || {}
        this.$set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        await this.$store.dispatch(`${this.moduleName}/getCols`, { etc: true })
        if (from && to) {
          this.from = from
          this.to = to
          await this.getMessages()
        } else {
          await this.$store.dispatch(`${this.moduleName}/initTime`)
          await this.getMessages()
        }
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
  mixins: [actions],
  components: { VirtualScrollList, EmptyPane }
}
</script>

<style>
</style>
