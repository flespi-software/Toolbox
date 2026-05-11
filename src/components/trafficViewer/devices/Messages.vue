<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9">
        <date-range-modal
          class="flex flex-center"
          :date="dateRange"
          :theme="theme"
          @save="dateRangeChange"
        />
      </q-toolbar>
      <div class="bg-grey-9 q-px-xs" style="border-top: 1px solid #424242;">
        <div class="flex items-center" style="height: 30px;">
          <q-btn dense flat round size="xs" icon="mdi-lan-connect" :color="eventFilter.connect ? 'green-4' : 'grey-7'" @click="toggleEventFilter('connect')"><q-tooltip>Connect</q-tooltip></q-btn>
          <q-btn dense flat round size="xs" icon="mdi-lan-disconnect" :color="eventFilter.disconnect ? 'red-4' : 'grey-7'" @click="toggleEventFilter('disconnect')"><q-tooltip>Disconnect</q-tooltip></q-btn>
          <q-btn dense flat round size="xs" icon="mdi-arrow-left-thick" :color="eventFilter.received ? 'purple-4' : 'grey-7'" @click="toggleEventFilter('received')"><q-tooltip>Data received</q-tooltip></q-btn>
          <q-btn dense flat round size="xs" icon="mdi-arrow-right-thick" :color="eventFilter.sent ? 'yellow-4' : 'grey-7'" @click="toggleEventFilter('sent')"><q-tooltip>Data sent</q-tooltip></q-btn>
          <q-space/>
          <q-badge v-if="connFilter !== null" color="amber-8" class="cursor-pointer q-mr-xs" @click.native="clearConnFilter">
            conn:#{{connFilter.toString().slice(-6)}} <q-icon name="mdi-close" size="12px" class="q-ml-xs"/>
          </q-badge>
          <q-btn dense flat round size="xs" icon="mdi-magnify" :color="hexSearchOpen ? 'white' : 'grey-5'" @click="toggleHexSearch"><q-tooltip>HEX search</q-tooltip></q-btn>
        </div>
        <div v-if="hexSearchOpen" class="flex items-center" style="height: 26px; padding-bottom: 4px;">
          <q-input ref="hexSearchInput" v-model="hexSearch" dense borderless dark placeholder="FF 00 AB..." input-class="text-white" class="full-width" style="font-size: 12px; font-family: monospace;" @input="debouncedHexSearch" @keydown.esc="toggleHexSearch">
            <template v-slot:append><q-icon v-if="hexSearch" name="mdi-close" size="14px" color="grey-5" class="cursor-pointer" @click="hexSearch = ''; updateHexSearch('')"/></template>
          </q-input>
        </div>
      </div>
      <div v-if="loadingFlag && itemsCount > 0" class="absolute-bottom-right absolute-top-left" :style="{overflow: 'hidden', top: topOffset}">
        <message-skeleton v-for="(_, index) in new Array(itemsCount).fill('')" :key="index"/>
      </div>
      <template v-else-if="!loadingFlag && filteredMessages.length">
        <VirtualList
          :onscroll="listScroll"
          ref="scroller"
          :style="{position: 'absolute', top: topOffset, bottom: 0, right: 0, left: 0, height: 'auto'}"
          :class="{'bg-grey-9': true, 'text-white': true, 'cursor-pointer': true}"
          :size="itemHeight"
          :remain="itemsCount"
          wclass="q-w-list"
        >
          <messages-list-item
            v-for="(item, index) in filteredMessages"
            :key="index"
            :item="item"
            :index="index"
            :actions="actions"
            :itemHeight="itemHeight"
            :selected="selected.includes(index)"
            :view="view"
            @action="actionHandler"
            @item-click="messageClickHandler"
            @conn-filter="setConnFilter"
            @mouseenter.native="highlightConn(item.conn)"
            @mouseleave.native="highlightConn(null)"
          />
        </VirtualList>
      </template>
      <div v-else-if="!loadingFlag && messages.length && !filteredMessages.length" class="text-center text-grey-5 q-pa-lg" :style="{marginTop: topOffset}">
        <q-icon name="mdi-filter-off-outline" size="2rem" class="q-mb-sm"/><br>
        No messages match current filters
      </div>
      <empty-pane v-else :config="config.emptyState"/>
    </div>
    <export-modal ref="export" :format="view" :dateRange="dateRange" :config="config" :item-id="active"/>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import get from 'lodash/get'
import throttle from 'lodash/throttle'
import { DateRangeModal } from 'qvirtualscroll'
import { copyToClipboard } from 'quasar'
import MessagesListItem from '../MessagesListItem.vue'
import EmptyPane from '../../EmptyPane'
import MessageSkeleton from '../MessageSkeleton'
import range from 'lodash/range'
import ExportModal from '../ExportModal'
import routerProcess from '../../../mixins/routerProcess'
import highlightMixin from '../highlightConnMixin'
import convertMixin from '../../../mixins/convert'

export default {
  props: [
    'activeId',
    'limit',
    'config',
    'view'
  ],
  data () {
    return {
      theme: this.config.theme,
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName,
      itemHeight: 53,
      itemsCount: 0,
      wrapperHeight: 0,
      needAutoScroll: true,
      selected: [],
      scrollerScrollTop: 0,
      isInit: false,
      eventFilter: { connect: true, disconnect: true, received: true, sent: true },
      connFilter: null,
      hexSearch: '',
      hexSearchNormalized: '',
      hexSearchOpen: false,
      eventCategories: {
        0: 'connect', 32: 'connect', 512: 'connect',
        1: 'disconnect', 33: 'disconnect', 513: 'disconnect',
        2: 'received', 130: 'received', 66: 'received', 34: 'received', 258: 'received', 514: 'received',
        3: 'sent', 67: 'sent', 131: 'sent', 35: 'sent', 259: 'sent', 515: 'sent'
      }
    }
  },
  computed: {
    active: {
      get () {
        return this.$store.state[this.moduleName].active
      },
      async set (id) {
        if (this.realtimeEnabled) {
          await this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`)
        }
        this.$store.commit(`${this.moduleName}/setActive`, id)
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        await this.$store.dispatch(`${this.moduleName}/getMessagesTail`)
        if (this.to > Date.now()) {
          await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`)
        }
        this.dateRangeChange(this.dateRange)
      }
    },
    messages: {
      get () {
        return this.$store.state[this.moduleName].messages
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setMessages`, val)
      }
    },
    currentLimit: {
      get () {
        return this.$store.state[this.moduleName].limit
      },
      set (limit) {
        this.$store.commit(`${this.moduleName}/setLimit`, limit)
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
      return this.$store.state[this.moduleName].messagePolling
    },
    loadingFlag () {
      const state = this.$store.state
      return !!(state[this.config.vuexModuleName] && state[this.config.vuexModuleName].isLoading)
    },
    topOffset () {
      return this.hexSearchOpen ? '110px' : '80px'
    },
    hasActiveFilters () {
      const ef = this.eventFilter
      return !(ef.connect && ef.disconnect && ef.received && ef.sent) || this.connFilter !== null || this.hexSearchNormalized.length > 0
    },
    filteredMessages () {
      if (!this.hasActiveFilters) return this.messages
      const hexNeedle = this.hexSearchNormalized
      return this.messages.filter(msg => {
        const cat = this.eventCategories[msg.type]
        if (cat && !this.eventFilter[cat]) return false
        if (this.connFilter !== null && msg.conn !== this.connFilter) return false
        if (hexNeedle && (!msg.data || !this.base64ToHex(msg.data).includes(hexNeedle))) return false
        return true
      })
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
    dateRangeChange (range) {
      this.updateRoute({
        query: {
          from: range[0] / 1000,
          to: range[1] / 1000
        }
      })
    },
    dateRangeChangeHandler (range) {
      const from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.from = from
      this.to = to
      if (this.realtimeEnabled) {
        this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`)
      }
      if (this.needAutoScroll && to <= Date.now()) {
        this.needAutoScroll = false
      }
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.dispatch(`${this.moduleName}/getMessages`)
        .then(() => {
          if (to > Date.now()) {
            this.$store.dispatch(`${this.moduleName}/pollingGetMessages`)
          }
        })
    },
    clearSelected () {
      this.selected = []
    },
    toggleEventFilter (key) {
      this.$set(this.eventFilter, key, !this.eventFilter[key])
      const ef = this.eventFilter
      if (!ef.connect && !ef.disconnect && !ef.received && !ef.sent) {
        this.eventFilter = { connect: true, disconnect: true, received: true, sent: true }
      }
      this.selected = []
      this.$emit('view-data', [])
    },
    setConnFilter (conn) {
      this.connFilter = conn
      this.selected = []
      this.$emit('view-data', [])
    },
    clearConnFilter () {
      this.connFilter = null
      this.selected = []
      this.$emit('view-data', [])
    },
    toggleHexSearch () {
      this.hexSearchOpen = !this.hexSearchOpen
      if (this.hexSearchOpen) {
        this.$nextTick(() => { this.$refs.hexSearchInput && this.$refs.hexSearchInput.focus() })
      } else if (this.hexSearch) {
        this.hexSearch = ''
        this.updateHexSearch('')
      }
    },
    updateHexSearch (val) {
      this.hexSearchNormalized = val.replace(/[\s:.-]/g, '').toUpperCase()
      this.selected = []
      this.$emit('view-data', [])
    },
    wrapperResizeHandler () {
      this.resetParams()
    },
    getScrollDirection (offset) {
      let verticalDirection = null
      if (offset > this.currentScrollTop) {
        verticalDirection = 'bottom'
      } else if (offset < this.currentScrollTop) {
        verticalDirection = 'top'
      } else {
        verticalDirection = 'none'
      }
      return verticalDirection
    },
    listScroll: function (e, data) {
      const { offset } = data
      if (!this.currentScrollTop) {
        this.currentScrollTop = offset
      }
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      if (!scrollerElement) { return false }
      const offsetAll = scrollerElement.scrollHeight - scrollerElement.clientHeight
      const verticalDirection = this.getScrollDirection(offset)
      const scrollOffset = offsetAll * 0.1
      this.allScrollTop = this.$refs.scroller ? this.$refs.scroller.$el.scrollHeight - this.$refs.scroller.$el.clientHeight : 0
      if (this.messages.length) {
        if (offset < this.currentScrollTop && this.needAutoScroll) {
          this.needAutoScroll = false
        } else if (!this.needAutoScroll && this.realtimeEnabled && offset >= this.allScrollTop) {
          this.needAutoScroll = true
        }
        this.currentScrollTop = offset
      }
      if (verticalDirection && (verticalDirection === 'top' || verticalDirection === 'none') && offset < scrollOffset) {
        this.debouncedGetMessagesPrev()
      } else if (verticalDirection && (verticalDirection === 'bottom' || verticalDirection === 'none') && offset + scrollOffset >= offsetAll) {
        this.debouncedGetMessagesNext()
      }
    },
    getMessagesPrev () {
      const scrollerElement = get(this.$refs, 'scroller.$el', undefined)
      const offsetAll = scrollerElement.scrollHeight - scrollerElement.clientHeight
      const scrollTop = scrollerElement.scrollTop
      this.$store.dispatch(`${this.moduleName}/getMessagesPrev`)
        .then((messages) => {
          if (messages && messages.length) {
            const newOffsetAll = scrollerElement.scrollHeight - scrollerElement.clientHeight
            scrollerElement.scrollTop = (newOffsetAll - offsetAll) + scrollTop
          }
        })
    },
    getMessagesNext () {
      this.$store.dispatch(`${this.moduleName}/getMessagesNext`)
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
      this.$emit('view-data', this.selected.map(index => ({ ...this.filteredMessages[index], index })))
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
    clear () {
      if (this.realtimeEnabled) {
        this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`)
      }
      this.$store.commit(`${this.moduleName}/clearMessages`)
    },
    exportModalOpen () { this.$refs.export.show() },
    highlightIncoming (timestamp) {
      const isTypeDataReceive = (type) => type === 2 || type === 130 || type === 66 || type === 34
      const { incomingMessageIndex, incomingMessageIndexEnd } = this.filteredMessages.reduce((result, message, index) => {
        if (isTypeDataReceive(message.type)) {
          if (result.incomingMessageIndex === -1) {
            result.incomingMessageIndex = index
          }
          // find first message index for tcp only
          if (
            message.type === 2 &&
            Math.floor(message.timestamp) === Math.floor(timestamp) &&
            result.incomingMessageIndexEnd === -1
          ) {
            result.incomingMessageIndexEnd = index
          }
          if (
            message.type != 2 &&
            Math.floor(message.timestamp) === Math.floor(timestamp)
          ) {
            result.incomingMessageIndexEnd = index
          }
        }
        return result
      }, { incomingMessageIndex: -1, incomingMessageIndexEnd: -1 })
      if (incomingMessageIndexEnd > -1) {
        this.messageClickHandler({ index: incomingMessageIndexEnd, event: {} })
      } else if (incomingMessageIndex > -1) {
        this.messageClickHandler({ index: incomingMessageIndex, event: {} })
      }
    },
    async init () {
      this.currentLimit = this.limit
      if (this.activeId && !this.$store.state[this.moduleName].active) {
        this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
      }
      const from = this.$route.query.from * 1000,
        to = this.$route.query.to * 1000,
        selectTime = this.$route.query.highlight || from
      if (from && to) {
        this.from = from
        this.to = to
        await this.$store.dispatch(`${this.moduleName}/getMessages`)
        this.$nextTick(() => this.highlightIncoming(selectTime))
      } else {
        await this.$store.dispatch(`${this.moduleName}/initTime`)
        await this.$store.dispatch(`${this.moduleName}/getMessagesTail`)
      }
      if (this.to > Date.now()) {
        await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`)
      }
      this.updateRoute({
        query: {
          from: this.from / 1000,
          to: this.to / 1000
        }
      }, true)
      this.isInit = true
    }
  },
  watch: {
    activeId (val) {
      this.clear()
      this.active = val
    },
    limit (limit) {
      this.currentLimit = limit
    },
    $route (route) {
      const from = route.query.from * 1000,
        to = route.query.to * 1000
      if (from && to && (this.dateRange[0] !== from || this.dateRange[1] !== to)) {
        this.dateRangeChangeHandler([from, to])
      }
    }
  },
  created () {
    this.debouncedGetMessagesPrev = throttle(this.getMessagesPrev, 2000, { trailing: false })
    this.debouncedGetMessagesNext = throttle(this.getMessagesNext, 2000, { trailing: false })
    this.debouncedHexSearch = throttle(this.updateHexSearch, 500, { leading: false, trailing: true })
    this.init()
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
    this.highlightConn(null)
    this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`)
    this.$store.commit(`${this.moduleName}/clearMessages`)
    this.to = 0
    this.from = 0
  },
  mixins: [routerProcess, highlightMixin, convertMixin],
  components: { MessagesListItem, VirtualList, EmptyPane, MessageSkeleton, DateRangeModal, ExportModal }
}
</script>
