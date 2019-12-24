<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9" v-if="(Object.keys(connections).length && mode) || !mode || type === 'messages'">
        <q-input v-model="filter" outlined hide-bottom-space rounded dense color="white" dark :placeholder="connection ? 'incoming or target *' : 'host:port'" :debounce="0" :style="{width: connection ? 'calc(100% - 50px)' : '100%'}">
          <q-icon slot="prepend" name="mdi-magnify" color="white" />
        </q-input>
        <q-btn title="Clear all connections" class="on-left pull-right text-center text-white" flat dense v-if="mode && !connection" @click="clearHandler">
          <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
          <div style="font-size: .7rem; line-height: .7rem;">Clear</div>
        </q-btn>
        <q-btn v-if="type === 'messages'" style="position: absolute; right: 5px;" class="text-white" flat round icon="mdi-close" @click="closeCurrentConnection">
          <q-tooltip>Close current connection</q-tooltip>
        </q-btn>
      </q-toolbar>
      <div class="flex flex-center" v-if="!mode && !connection" style="min-height: 50px;">
        <q-btn flat :color="theme.color" style="max-width: 120px; font-size: .8rem; line-height: .8rem;" class="q-pa-sm" @click="$refs.datePickerModal.toggle()">
          <div>{{formatDate(from)}}</div>
        </q-btn>
        <q-dialog ref="datePickerModal" :content-css="{maxWidth: '500px'}" class="modal-date" :maximized="$q.platform.is.mobile">
          <q-card :style="{minWidth: $q.platform.is.mobile ? '100%' : '30vw'}" class="bg-grey-9">
            <q-card-section class="q-pa-none">
              <q-toolbar>
                <div class="q-toolbar-title text-h6 text-white">
                  Date/Time
                </div>
              </q-toolbar>
            </q-card-section>
            <q-separator />
            <q-card-section :style="{height: $q.platform.is.mobile ? 'calc(100% - 104px)' : ''}" class="scroll">
              <div class="flex flex-center">
                <vue-flat-pickr
                  v-model="fromModel"
                  :config="dateConfig"
                  :theme="theme"
                />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat :color="theme.color" @click="datePickerModalClose">close</q-btn>
              <q-btn flat :color="theme.color" @click="datePickerModalSave">save</q-btn>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <template v-if="messages.length && Object.keys(renderEntities).length">
        <VirtualList
          :onscroll="listScroll"
          ref="scroller"
          :style="{position: 'absolute', top: mode || connection ? '50px' : '100px', bottom: mode ? 0 : '36px', right: 0, left: 0, height: 'auto'}"
          :class="{'bg-grey-9': true, 'text-white': true, 'cursor-pointer': true}"
          :size="itemHeight"
          :remain="itemsCount"
          :debounce="10"
          wclass="q-w-list"
        >
          <component
            :is="`${type}-list-item`"
            v-for="(item, index) in renderEntities"
            :key="`${type}-${index}`"
            :item="item"
            :index="index"
            :actions="actions"
            :itemHeight="itemHeight"
            :selected="selected.includes(index)"
            @action="actionHandler"
            @item-click="itemClickHandler"
          />
        </VirtualList>
        <q-btn v-if="!mode" color="grey-9" style="position: absolute; bottom: 0; width: 100%;" class="text-white" icon="mdi-download" @click="paginationNextChangeHandler">Get more</q-btn>
      </template>
      <empty-pane v-else :config="config.emptyState"/>
    </div>
  </div>
</template>

<script>
import { channelsMessagesModulePull } from 'qvirtualscroll'
import VirtualList from 'vue-virtual-scroll-list'
import { VueFlatPickr } from 'datetimerangepicker'
import Vue from 'vue'
import { date, copyToClipboard } from 'quasar'
import filterMessages from '../../mixins/filterMessages'
import MessagesListItem from './MessagesListItem.vue'
import ConnectionsListItem from './ConnectionsListItem.vue'
import EmptyPane from '../EmptyPane'
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
      filter: '',
      connectionsFilter: '',
      messagesPerConnectionLimit: 10000,
      connectionsLimit: 100,
      scrollerScrollTop: 0,
      dateConfig: {
        enableTime: true,
        time_24hr: true,
        inline: true,
        maxDate: (new Date()).setHours(23, 59, 59, 999),
        mode: 'single',
        locale: { firstDayOfWeek: 1 }
      },
      fromModel: this.from
    }
  },
  computed: {
    renderEntities () {
      let entities = this.connection
        ? this.currentMessages
        : this.currentConnections
      return entities
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
      async set (active) {
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active channel */
        this.$store.commit(`${this.moduleName}/setActive`, active)
        let activeItem = this.$store.state.channels[active] || {}
        Vue.set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        await this.$store.dispatch(`${this.moduleName}/getCols`)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.clearSelected()
        switch (this.mode) {
          case 0: {
            if (active) {
              this.getMessages()
            }
            break
          }
          case 1: {
            if (active) {
              this.$store.dispatch(`${this.moduleName}/pollingGet`)
            }
            break
          }
        }
      }
    },
    from: {
      get () {
        let module = this.$store.state[this.moduleName],
          from = module.messages[0] && module.messages[0].timestamp ? Math.ceil(module.messages[0].timestamp * 1000) : Date.now()
        this.setFromModel(from)
        return from
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
    },
    loadingFlag () {
      let state = this.$store.state
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
      this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active channel */
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
        case 1: {
          if (this.active) {
            this.$store.dispatch(`${this.moduleName}/pollingGet`)
          }
          break
        }
      }
    },
    paginationNextChangeHandler () {
      this.$store.commit(`${this.moduleName}/setFrom`, this.$store.state[this.moduleName].to)
      this.getMessages()
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
      this.$emit('view-data', content)
    },
    itemClickHandler ({ index, content, event }) {
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
        if (this.$refs.scroller && this.$refs.scroller.$el) {
          this.scrollerScrollTop = this.$refs.scroller.$el.scrollTop
        }
        this.$emit('change:connection', content)
      }
    },
    copyMessageHandler ({ index, content }) {
      copyToClipboard(JSON.stringify(content)).then((e) => {
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
    },
    setFromModel (from) {
      this.fromModel = from
    },
    formatDate (timestamp) {
      return date.formatDate(timestamp, 'DD/MM/YYYY HH:mm:ss')
    },
    datePickerModalClose () {
      this.fromModel = this.from
      this.$refs.datePickerModal.hide()
    },
    datePickerModalSave () {
      this.from = this.fromModel
      this.$refs.datePickerModal.hide()
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
        channelsMessagesModulePull(
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
  components: { MessagesListItem, VirtualList, ConnectionsListItem, VueFlatPickr, EmptyPane }
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
