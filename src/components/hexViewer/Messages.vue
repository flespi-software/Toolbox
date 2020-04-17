<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9" v-if="loadingFlag || (!loadingFlag && ((Object.keys(connections).length) || type === 'messages'))">
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
        <VirtualList
          :onscroll="listScroll"
          ref="scroller"
          :style="{position: 'absolute', top: connection ? '50px' : '100px', bottom: 0, right: 0, left: 0, height: 'auto'}"
          :class="{'bg-grey-9': true, 'text-white': true, 'cursor-pointer': true}"
          :size="itemHeight"
          :remain="itemsCount"
          wclass="q-w-list"
        >
          <template v-if="type === 'connections'">
            <connections-list-item
              v-for="(item, index) in currentConnections"
              :key="item.peer"
              :class="{'connection--visited': visitedConnections.includes(item.peer), [`connection__${index}`]: true}"
              :item="item"
              :index="index"
              :count="item.messages.length"
              :itemHeight="itemHeight"
              @item-click="connectionClickHandler"
              @mouseenter.native="previewConnectionHandler(item)"
              @mouseleave.native="previewConnectionCloseHandler(item)"
            />
          </template>
          <template v-else>
            <messages-list-item
              v-for="(item, index) in currentMessages"
              :key="index"
              :item="item"
              :index="index"
              :actions="actions"
              :itemHeight="itemHeight"
              :selected="selected.includes(index)"
              :view="view"
              @action="actionHandler"
              @item-click="messageClickHandler"
            />
          </template>
        </VirtualList>
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
      visitedConnections: []
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
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setLimit`, val) : this.$store.commit(`${this.moduleName}/setLimit`, 0)
      }
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    }
  },
  methods: {
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
      this.$eventBus.$emit('view-data', content)
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
      } else if (event.ctrlKey) {
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
    this.currentLimit = this.limit
    if (this.activeId) {
      this.active = this.activeId
    }
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      this.$store.commit(`${this.moduleName}/setOffline`, this.realtimeEnabled)
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`, this.realtimeEnabled)
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
  components: { MessagesListItem, VirtualList, ConnectionsListItem, EmptyPane, DateRangeModal, ConnectionSkeleton }
}
</script>

<style lang="stylus">
  .connection--visited
    .connection__peer
      text-decoration underline
      color $purple-5!important
</style>
