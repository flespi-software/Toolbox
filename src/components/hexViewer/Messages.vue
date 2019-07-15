<template>
  <div ref="wrapper">
    <q-resize-observable @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar color="dark" v-if="(Object.keys(connections).length && mode) || !mode || type === 'messages'">
        <q-search
          :class="{collapsed: !mode && !showSearch}"
          @focus="showSearch = true"
          @blur="searchBlurHandler"
          v-if="showSearch || mode || filter"
          :autofocus="!mode"
          type="text" v-model="filter"
          inverted
          :placeholder="connection ? 'incoming or target *' : 'host:port'"
          :debounce="0"
          color="none"
          style="margin-right: 5px"
          :style="{width: mode && connection ? 'calc(100% - 50px)' : '100%'}"
        />
        <q-icon name="search" @click.native="showSearch = true"
          v-else
          :style="{fontSize: '24px', paddingLeft: '8px', marginRight: '5px'}"
          class="cursor-pointer"
        />
        <q-datetime
          v-if="!mode && !showSearch && !connection"
          format="DD-MM-YYYY HH:mm:ss"
          @change="(val) => { from = val }"
          :value="from"
          inverted
          color="grey-8"
          type="datetime"
          format24h
          class="vsl-date"
          style="margin-right: 5px"
        />
        <q-btn v-if="!mode && !showSearch" class="text-white q-mr-sm" icon="arrow_forward" @click="paginationNextChangeHandler"/>
        <q-btn v-if="type === 'messages' && (!showSearch || mode)" style="position: absolute; right: 5px;" class="text-white" icon="mdi-close" @click="closeCurrentConnection">
          <q-tooltip>Close current connection</q-tooltip>
        </q-btn>
      </q-toolbar>
      <template v-if="messages.length && Object.keys(renderEntities).length">
      <VirtualList
        :onscroll="listScroll"
        ref="scroller"
          :style="{position: 'absolute', top: '50px', bottom: mode ? 0 : '36px', right: 0, left: 0, height: 'auto'}"
        :class="{'bg-dark': true, 'text-white': true, 'cursor-pointer': true}"
        :size="itemHeight"
        :remain="itemsCount"
        :debounce="10"
        wclass="q-w-list">
        <component
          :is="`${type}-list-item`"
          v-for="(item, index) in renderEntities"
          :key="`${JSON.stringify(item)}${index}`"
          :item="item"
          :index="index"
          :actions="actions"
          :itemHeight="itemHeight"
          :selected="selected.includes(index)"
          @action="actionHandler"
          @item-click="itemClickHandler"
        />
      </VirtualList>
        <q-btn v-if="!mode" color="dark" style="position: absolute; bottom: 0; width: 100%;" class="text-white" icon="mdi-download" @click="paginationNextChangeHandler">Get more</q-btn>
      </template>
      <div v-else class="no-messages text-center" :class="{'text-grey-6': true}"
            style="font-size: 3rem; padding-top: 40px; ">{{`${type === 'connections' ? 'No connections' : 'No events'}`}}
      </div>
    </div>
  </div>
</template>

<script>
import { channelsMessagesModule } from 'qvirtualscroll'
import VirtualList from 'vue-virtual-scroll-list'
import Vue from 'vue'
import { date } from 'quasar'
import filterMessages from '../../mixins/filterMessages'
import MessagesListItem from './MessagesListItem.vue'
import ConnectionsListItem from './ConnectionsListItem.vue'
import range from 'lodash/range'

export default {
  props: [
    'mode',
    'activeId',
    'connection',
    'limit',
    'config',
    'type'
  ],
  data () {
    return {
      theme: this.config.theme,
      i18n: {},
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName,
      itemHeight: 56,
      itemsCount: 0,
      wrapperHeight: 0,
      needAutoScroll: !!this.mode,
      connections: {},
      connectionsByIndex: [],
      selected: [],
      showSearch: false,
      filter: '',
      connectionsFilter: '',
      messagesPerConnectionLimit: 10000,
      connectionsLimit: 100,
      scrollerScrollTop: 0
    }
  },
  computed: {
    renderEntities () {
      return this.connection
        ? this.currentMessages
        : this.currentConnections
    },
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
      async set (val) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active channel */
        this.$store.commit(`${this.moduleName}/setActive`, val)
        let activeItem = this.$store.state.items[val] || {}
        Vue.set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        await this.$store.dispatch(`${this.moduleName}/getCols`)
        this.modeChange(this.mode)
        this.$store.dispatch(`${this.moduleName}/pollingGet`)
      }
    },
    from: {
      get () {
        let module = this.$store.state[this.moduleName]
        return module.messages[0] && module.messages[0].timestamp ? Math.ceil(module.messages[0].timestamp * 1000) : Date.now()
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setFrom`, Math.ceil(new Date(val).setSeconds(0) / 1000)) : this.$store.commit(`${this.moduleName}/setFrom`, 0)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.clearConnections()
        this.getMessages()
      }
    },
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setLimit`, val) : this.$store.commit(`${this.moduleName}/setLimit`, 1000)
      }
    }
  },
  methods: {
    resetParams () {
      if (!this.$refs.wrapper) {
        return false
      }
      this.wrapperHeight = this.$refs.wrapper.offsetHeight - this.itemHeight // - header - scroll-bottom
      this.itemsCount = Math.ceil(this.wrapperHeight / this.itemHeight)
      if (this.$refs.scroller) {
        let element = this.$refs.scroller.$el
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
        } else if (!this.needAutoScroll && this.mode === 1 && data.offset >= this.allScrollTop) {
          this.needAutoScroll = true
        }
        this.currentScrollTop = data.offset
      }
    },
    filterMessages (message) {
      if ('incoming'.indexOf(this.filter) === 0 && message['proxy.source'] === 0) {
        return true
      } else if (/^target(\s){0,1}(\d){0,1}$/.test(this.filter) || 'target'.indexOf(this.filter) === 0) {
        let target = parseInt(this.filter.split(' ')[1] || 0)
        return target ? message['proxy.source'] === target : !!message['proxy.source']
      } else { return false }
    },
    setTranslation (messages) {
      this.i18n.to = messages.length ? `Next batch from ${date.formatDate(this.from * 1000, 'HH:mm:ss')}` : 'Next'
    },
    newMessagesInterseptor (messages) {
      if (!messages.length) {
        this.clearConnections()
        return false
      }
      let cb = this.connection ? this.poolConnection : this.poolConnections
      messages.forEach(cb)
      if (this.connectionsByIndex.length > this.connectionsLimit) {
        let ident = this.connectionsByIndex[0]
        delete this.connections[ident]
        this.connectionsByIndex.shift()
      }
    },
    poolConnections (message) {
      let ident = message['ident']
      if (!this.connections[ident]) {
        this.connections[ident] = {
          messages: [],
          peer: message['peer'],
          ident: ident
        }
        this.connectionsByIndex.push(ident)
      }
      this.connections[ident].messages.push(message)
    },
    poolConnection (message) {
      if (message['ident'] === this.connection['ident']) {
        this.connection.messages.push(message)
      }
    },
    getMessages () {
      return this.$store.dispatch(`${this.moduleName}/get`)
    },
    modeChange (val) {
      val = +val
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.commit(`${this.moduleName}/setMode`, val)
      this.needAutoScroll = !!val
      this.clearSelected()
      switch (val) {
        case 0: {
          if (this.active) {
            this.getMessages()
          }
          break
        }
      }
    },
    paginationNextChangeHandler () {
      this.getMessages()
    },
    actionHandler ({index, type, content}) {
      switch (type) {
        case 'view': {
          this.viewMessagesHandler({index, content})
          break
        }
        case 'copy': {
          this.copyMessageHandler({index, content})
          break
        }
      }
    },
    viewMessagesHandler ({index, content}) {
      this.selected = [index]
      this.$emit('view-data', content)
    },
    itemClickHandler ({index, content, event}) {
      if (this.type === 'messages') {
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
            let selected = this.selected
            selected.splice(this.selected.indexOf(index), 1)
            this.selected = selected
          } else {
            this.selected = [...this.selected, index]
          }
        } else {
          this.selected = [index]
        }
        this.$emit('view-data', this.connection.messages.filter((message, index) => this.selected.includes(index)))
      } else if (this.type === 'connections') {
        this.scrollerScrollTop = this.$refs.scroller.$el.scrollTop
        this.$emit('change:connection', content)
      }
    },
    copyMessageHandler ({index, content}) {
      this.$copyText(JSON.stringify(content)).then((e) => {
        this.$q.notify({
          type: 'positive',
          icon: 'content_copy',
          message: `Message copied`,
          timeout: 1000
        })
      }, (e) => {
        this.$q.notify({
          type: 'negative',
          icon: 'content_copy',
          message: `Error coping messages`,
          timeout: 1000
        })
      })
    },
    unselect () {
      if (this.selected.length) {
        this.selected = []
      }
    },
    searchBlurHandler () {
      this.showSearch = false
    },
    clearConnections () {
      this.connections = {}
      this.connectionsByIndex = []
    },
    closeCurrentConnection () {
      this.$emit('close')
      this.$nextTick(() => {
        this.$refs.scroller.$el.scrollTop = this.scrollerScrollTop
      })
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    },
    mode (mode) {
      this.filter = ''
      this.modeChange(mode)
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
        channelsMessagesModule(
          {
            Vue,
            LocalStorage: this.$q.localStorage,
            name: this.moduleName,
            errorHandler: (err) => { this.$store.commit('reqFailed', err) },
            filterHandler: this.filterMessage,
            newMessagesInterseptor: this.newMessagesInterseptor
          }
        )
      )
    }
    this.currentLimit = this.limit
    if (this.activeId) {
      this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
    }
    if (this.$store.state[this.moduleName].mode === null) {
      this.modeChange(this.mode)
      this.$store.dispatch(`${this.moduleName}/pollingGet`)
    }
    this.offlineHandler = Vue.connector.socket.on('offline', () => {
      if (this.mode === 1) {
        this.$store.commit(`${this.moduleName}/setOffline`, this.mode === 1)
      }
    })
    this.connectHandler = Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`, this.mode === 1)
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
      if (this.needAutoScroll && this.$refs.scroller) { this.$refs.scroller.$el.scrollTop = this.$refs.scroller.$el.scrollHeight }
    }
  },
  destroyed () {
    this.offlineHandler !== undefined && Vue.connector.socket.off('offline', this.offlineHandler)
    this.connectHandler !== undefined && Vue.connector.socket.off('connect', this.connectHandler)
    this.$store.commit(`${this.moduleName}/clear`)
    this.$store.unregisterModule(this.moduleName)
  },
  mixins: [filterMessages],
  components: { MessagesListItem, VirtualList, ConnectionsListItem }
}
</script>

<style lang="stylus">
.vsl-date
  display inline-flex
  max-width 105px
  .row .col
    font-size 13px
    white-space inherit
    text-align center
    line-height 15px
  i
    display none
</style>
