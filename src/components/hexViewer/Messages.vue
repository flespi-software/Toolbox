<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9" v-if="(!loadingFlag && ((Object.keys(connections).length) || type === 'messages'))">
        <q-input v-model="filter" outlined hide-bottom-space rounded dense color="white" dark :placeholder="connection ? 'incoming or target *' : 'host:port'" :debounce="0" :style="{width: connection ? 'calc(100% - 50px)' : '100%'}">
          <q-icon slot="prepend" name="mdi-magnify" color="white" />
        </q-input>
        <q-btn title="Clear all connections" class="pull-right text-center text-white" flat dense v-if="!connection" @click="clearHandler">
          <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
          <div style="font-size: .7rem; line-height: .7rem;">Clear</div>
        </q-btn>
        <q-btn v-if="type === 'messages'" style="position: absolute; right: 5px;" class="text-white" flat round icon="mdi-close" @click="closeCurrentConnection">
          <q-tooltip>Close current connection</q-tooltip>
        </q-btn>
      </q-toolbar>
      <date-range-modal
        v-if="!connection"
        class="flex flex-center"
        :date="dateRange"
        :theme="theme"
        @save="dateRangeChangeHandler"
      />
      <div v-if="loadingFlag && !connection && itemsCount > 0" class="absolute-bottom-right absolute-top-left" style="overflow: hidden;">
        <connection-skeleton v-for="(_, index) in new Array(itemsCount).fill('')" :key="index"/>
      </div>
      <template v-else-if="!loadingFlag && messages.length">
        <template v-if="type === 'connections'">
          <virtual-list
            ref="scroller"
            class="absolute-top-left absolute-bottom-right bg-grey-9 text-white cursor-pointer"
            wclass="q-w-list"
            :style="{top: '100px', height: 'auto'}"
            :onscroll="listScroll"
            :size="itemHeight"
            :remain="itemsCount"
            :item="ConnectionsListItem"
            :itemcount="connectionsByIndex.length"
            :itemprops="getConnectionItem"
          />
        </template>
        <template v-else>
          <virtual-list
            ref="scroller"
            class="absolute-top-left absolute-bottom-right bg-grey-9 text-white cursor-pointer"
            wclass="q-w-list"
            :style="{top: '50px', height: 'auto'}"
            :onscroll="listScroll"
            :size="itemHeight"
            :remain="itemsCount"
            :item="MessagesListItem"
            :itemcount="currentMessages.length"
            :itemprops="getMessageItem"
          />
        </template>
      </template>
      <empty-pane v-else :config="config.emptyState"/>
    </div>
  </div>
</template>

<script>
import { DateRangeModal, channelsMessagesModuleSerial } from 'qvirtualscroll'
import VirtualList from 'vue-virtual-scroll-list'
import Vue from 'vue'
import { copyToClipboard } from 'quasar'
import filterMessages from '../../mixins/filterMessages'
import MessagesListItem from './MessagesListItem.vue'
import ConnectionsListItem from './ConnectionsListItem.vue'
import EmptyPane from '../EmptyPane'
import ConnectionSkeleton from './ConnectionSkeleton'
import range from 'lodash/range'

export default {
  props: [
    'activeId',
    'connection',
    'limit',
    'config',
    'type',
    'view'
  ],
  data () {
    return {
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName,
      itemHeight: 56,
      itemsCount: 0,
      wrapperHeight: 0,
      needAutoScroll: true,
      connections: {},
      connectionsByIndex: [],
      selected: [],
      filter: '',
      connectionsFilter: '',
      scrollerScrollTop: 0,
      visitedConnections: [],
      MessagesListItem,
      ConnectionsListItem
    }
  },
  computed: {
    currentConnections () {
      return this.filter ? this.connectionsByIndex.reduce((res, connectionId) => {
        if (this.connections[connectionId].peer.indexOf(this.filter) !== -1) {
          res[connectionId] = this.connections[connectionId]
        }
        return res
      }, {}) : this.connections
    },
    currentMessages () {
      return this.filter ? this.connection.messages.filter(this.filterMessages) : this.connection.messages
    },
    messages: {
      get () {
        return this.$store.state[this.moduleName].messages
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setMessages`, val)
      }
    },
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (id) {
        if (this.realtimeEnabled) {
          await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
        }
        this.$store.commit(`${this.moduleName}/setActive`, id)
        const activeItem = this.$store.state.channels[id] || {}
        Vue.set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        this.$store.commit(`${this.moduleName}/clearMessages`)
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        this.clearSelected()
        await this.$store.dispatch(`${this.moduleName}/get`)
        if (this.to > Date.now()) {
          const render = await this.$store.dispatch(`${this.moduleName}/pollingGet`)
          render()
        }
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
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (val) {
        val = val || 0
        this.$store.commit(`${this.moduleName}/setLimit`, val)
      }
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    }
  },
  methods: {
    getConnectionItem (index) {
      const item = this.currentConnections[this.connectionsByIndex[index]]
      const props = {
        key: item.peer,
        props: {
          item,
          index,
          count: item.messages.length,
          itemHeight: this.itemHeight
        },
        class: {
          'connection--visited': this.visitedConnections.includes(item.peer),
          [`connection__${index}`]: true
        },
        on: {
          'item-click': this.connectionClickHandler
        },
        nativeOn: {
          mouseenter: () => this.previewConnectionHandler(item),
          mouseleave: () => this.previewConnectionCloseHandler(item)
        }
      }
      return props
    },
    getMessageItem (index) {
      const item = this.currentMessages[index]
      const props = {
        key: index,
        props: {
          item,
          index,
          actions: this.actions,
          itemHeight: this.itemHeight,
          selected: this.selected.includes(index),
          view: this.view
        },
        on: {
          action: this.actionHandler,
          'item-click': this.messageClickHandler
        }
      }
      return props
    },
    resetParams () {
      if (!this.$refs.wrapper) {
        return false
      }
      this.wrapperHeight = this.$refs.wrapper.offsetHeight - this.itemHeight // - header - scroll-bottom
      this.itemsCount = Math.ceil(this.wrapperHeight / this.itemHeight)
      this.$refs.scroller && this.$refs.scroller.forceRender()
      if (this.$refs.scroller && this.$refs.scroller.$el) {
        const element = this.$refs.scroller.$el
        element.scrollTop += 1
      }
    },
    clearSelected () {
      this.selected = []
    },
    wrapperResizeHandler () {
      this.resetParams()
    },
    listScroll: function (e, data) {
      if (!this.currentScrollTop) {
        this.currentScrollTop = data.offset
      }
      this.allScrollTop = this.$refs.scroller ? this.$refs.scroller.$el.scrollHeight - this.$refs.scroller.$el.clientHeight : 0
      if (this.messages.length) {
        if (data.offset < this.currentScrollTop && this.needAutoScroll) {
          this.needAutoScroll = false
        } else if (!this.needAutoScroll && this.realtimeEnabled && data.offset >= this.allScrollTop) {
          this.needAutoScroll = true
        }
        this.currentScrollTop = data.offset
      }
    },
    filterMessages (message) {
      if ('incoming'.indexOf(this.filter) === 0 && message['proxy.source'] === 0) {
        return true
      } else if (/^target(\s){0,1}(\d){0,1}$/.test(this.filter) || 'target'.indexOf(this.filter) === 0) {
        const target = parseInt(this.filter.split(' ')[1] || 0)
        return target ? message['proxy.source'] === target : !!message['proxy.source']
      } else { return false }
    },
    newMessagesInterseptor (messages) {
      if (!messages.length) {
        this.clearConnections()
        return false
      }
      const cb = this.connection ? this.poolConnection : this.poolConnections
      messages.forEach(cb)
    },
    poolConnections (message) {
      const ident = message.ident
      if (!this.connections[ident]) {
        this.connections[ident] = {
          messages: [],
          peer: message.peer,
          ident: ident
        }
        this.connectionsByIndex.push(ident)
      }
      this.connections[ident].messages.push(message)
    },
    poolConnection (message) {
      if (message.ident === this.connection.ident) {
        this.connection.messages.push(message)
      }
    },
    // getMessages () {
    //   return this.$store.dispatch(`${this.moduleName}/get`)
    // },
    dateRangeChangeHandler (range) {
      const from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.from = from
      this.to = to
      if (this.realtimeEnabled) {
        this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
      }
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/get`)
        .then(() => {
          if (to > Date.now()) {
            this.$store.dispatch(`${this.moduleName}/pollingGet`).then(r => r())
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
      }
    },
    viewMessagesHandler ({ index, content }) {
      this.selected = [index]
      this.$root.$emit('view-data', content)
    },
    connectionClickHandler ({ index, content, event }) {
      if (this.$refs.scroller && this.$refs.scroller.$el) {
        this.scrollerScrollTop = this.$refs.scroller.$el.scrollTop
      }
      this.visitedConnections.push(content.peer)
      this.$emit('change:connection', content)
    },
    messageClickHandler ({ index, content, event }) {
      if (event.shiftKey) {
        if (this.selected[0]) {
          if (this.selected[0] > index) {
            this.selected = range(index, this.selected[0] + 1)
          } else {
            this.selected = range(this.selected[0], index + 1)
          }
        } else {
          this.selected = [index]
        }
      } else if (event.ctrlKey || event.metaKey) {
        if (this.selected.includes(index)) {
          const selected = this.selected
          selected.splice(this.selected.indexOf(index), 1)
          this.selected = selected
        } else {
          this.selected = [...this.selected, index]
        }
      } else {
        this.selected = [index]
      }
      if (this.needAutoScroll) { this.needAutoScroll = false }
      this.selected.sort((a, b) => a - b)
      this.$emit('view-data', this.selected.map(index => this.connection.messages[index]))
    },
    previewConnectionHandler (connection) {
      this.$emit('connection:preview', connection)
    },
    previewConnectionCloseHandler (connection) {
      this.$emit('connection:preview-hide', connection)
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
        this.selected = []
      }
    },
    clearConnections () {
      this.connections = {}
      this.connectionsByIndex = []
    },
    closeCurrentConnection () {
      this.$emit('close')
      this.$nextTick(() => {
        if (this.$refs.scroller && this.$refs.scroller.$el) {
          this.$refs.scroller.$el.scrollTop = this.scrollerScrollTop
        }
      })
    },
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all connections?',
        ok: true,
        cancel: true
      }).onOk(() => { this.$store.commit(`${this.moduleName}/clearMessages`) })
        .onCancel(() => {})
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    },
    limit (limit) {
      this.currentLimit = limit
    },
    type (type) {
      this.clearSelected()
      this.resetParams()
      if (type === 'connections') {
        this.newMessagesInterseptor(this.messages)
        this.filter = this.connectionsFilter
      } else {
        this.clearConnections()
        this.connectionsFilter = this.filter
        this.filter = ''
      }
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(
        this.moduleName,
        channelsMessagesModuleSerial(
          {
            Vue,
            LocalStorage: this.$q.localStorage,
            name: { name: this.moduleName, lsNamespace: 'flespi-toolbox-settings.cols' },
            errorHandler: (err) => { this.$store.commit('reqFailed', err) },
            filterHandler: this.filterMessage,
            newMessagesInterseptor: this.newMessagesInterseptor
          }
        )
      )
    }
    if (this.activeId) {
      this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
      const activeItem = this.$store.state.channels[this.activeId] || {}
      this.$set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
    }
    this.currentLimit = this.limit
    const from = this.$route.query.from,
      to = this.$route.query.to,
      ident = this.$route.query.ident
    if (from && to) {
      this.from = from
      this.to = to
      this.$store.dispatch(`${this.moduleName}/get`).then(() => {
        if (this.to > Date.now()) {
          this.$store.dispatch(`${this.moduleName}/pollingGet`).then(render => render())
        }
        if (ident) {
          const connetion = this.connections[ident]
          this.connectionClickHandler({ content: connetion })
          this.$nextTick(() => {
            const incomingMessageIndex = this.currentMessages.findIndex(message => message['proxy.source'] === 0 && Math.floor(message.timestamp * 1000) === to)
            if (incomingMessageIndex > -1) {
              this.messageClickHandler({ index: incomingMessageIndex, event: {} })
            }
          })
        }
      })
    } else {
      this.$store.dispatch(`${this.moduleName}/initTime`).then(() => {
        this.$store.dispatch(`${this.moduleName}/get`).then(() => {
          if (this.to > Date.now()) {
            this.$store.dispatch(`${this.moduleName}/pollingGet`).then(render => render())
          }
        })
      })
    }
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`)
      }
    })
  },
  mounted () {
    this.resetParams()
  },
  updated () {
    if (!this.messages.length) {
      this.currentScrollTop = 0
    } else {
      if (this.needAutoScroll && this.$refs.scroller && this.$refs.scroller.$el) { this.$refs.scroller.$el.scrollTop = this.$refs.scroller.$el.scrollHeight }
    }
  },
  destroyed () {
    this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)
    this.offlineHandler !== undefined && Vue.connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && Vue.connector.socket.off('connect', this.connectHandler)
    this.$store.commit(`${this.moduleName}/clear`)
    this.$store.unregisterModule(this.moduleName)
  },
  mixins: [filterMessages],
  components: { VirtualList, EmptyPane, DateRangeModal, ConnectionSkeleton }
}
</script>

<style lang="stylus">
  .connection--visited
    .connection__peer
      text-decoration underline
      color $purple-5!important
</style>
