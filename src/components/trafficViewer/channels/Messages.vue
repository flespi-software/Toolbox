<template>
  <div ref="wrapper">
    <q-resize-observer @resize="wrapperResizeHandler"/>
    <div>
      <q-toolbar class="bg-grey-9">
        <q-btn class="text-white" flat dense rounded icon="mdi-arrow-left" @click="closeDevice" v-if="deviceCloseble">
          <q-tooltip>Close current device</q-tooltip>
        </q-btn>
        <q-toolbar-title v-if="deviceCloseble"></q-toolbar-title>
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
          <q-badge v-if="connFilter !== null" color="amber-8" class="cursor-pointer q-mr-xs" @click="clearConnFilter">
            conn:#{{connFilter.toString().slice(-6)}} <q-icon name="mdi-close" size="12px" class="q-ml-xs"/>
          </q-badge>
          <q-btn dense flat round size="xs" icon="mdi-magnify" :color="hexSearchOpen ? 'white' : 'grey-5'" @click="toggleHexSearch"><q-tooltip>HEX search</q-tooltip></q-btn>
        </div>
        <div v-if="hexSearchOpen" class="flex items-center" style="height: 26px; padding-bottom: 4px;">
          <q-input ref="hexSearchInput" v-model="hexSearch" dense borderless dark placeholder="FF 00 AB..." input-class="text-white" class="full-width" style="font-size: 12px; font-family: monospace;" @update:model-value="debouncedHexSearch" @keydown.esc="toggleHexSearch">
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
            @mouseenter="highlightConn(item.conn)"
            @mouseleave="highlightConn(null)"
          />
        </VirtualList>
      </template>
      <div v-else-if="!loadingFlag && messages.length && !filteredMessages.length" class="text-center text-grey-5 q-pa-lg" :style="{marginTop: topOffset}">
        <q-icon name="mdi-filter-off-outline" size="2rem" class="q-mb-sm"/><br>
        No messages match current filters
      </div>
      <empty-pane v-else :config="config.emptyState"/>
    </div>
    <export-modal ref="export" :format="view" :dateRange="dateRange" :config="config" :ident="device.ident" :item-id="activeId"/>
  </div>
</template>

<script>
import VirtualList from 'src/qvirtualscroll/components/VirtualList'
import get from 'lodash/get'
import throttle from 'lodash/throttle'
import DateRangeModal from 'src/qvirtualscroll/components/DateRangeModal.vue'
import { copyToClipboard } from 'quasar'
import MessagesListItem from '../MessagesListItem.vue'
import EmptyPane from '../../EmptyPane.vue'
import MessageSkeleton from '../MessageSkeleton.vue'
import range from 'lodash/range'
import ExportModal from '../ExportModal.vue'
import routerProcess from '../../../mixins/routerProcess'
import highlightMixin from '../highlightConnMixin'
import convertMixin from '../../../mixins/convert'
import { buildPacketsFilter, packetMatches, normalizeHex } from 'src/stores/traffic/packetsFilter'
import { useTrafficViewerStore } from 'src/stores/traffic/trafficViewer'

export default {
  props: [
    'activeId',
    'device',
    'limit',
    'config',
    'view',
    'deviceCloseble'
  ],
  /* the viewer registered this store as a Vuex module and reached it by name */
  setup (props) {
    const trafficStore = useTrafficViewerStore({ name: props.config.vuexModuleName })
    return { trafficStore }
  },
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
      hexSearchOpen: false
    }
  },
  computed: {
    messages: {
      get () {
        return this.trafficStore.messages
      },
      set (val) {
        this.trafficStore.setMessages(val)
      }
    },
    currentLimit: {
      get () {
        return this.trafficStore.limit
      },
      set (limit) {
        this.trafficStore.setLimit(limit)
      }
    },
    dateRange () {
      return [this.trafficStore.from, this.trafficStore.to]
    },
    from: {
      get () {
        return this.trafficStore.from
      },
      set (val) {
        val = val || 0
        this.trafficStore.setFrom(val)
      }
    },
    to: {
      get () {
        return this.trafficStore.to
      },
      set (val) {
        val = val || 0
        this.trafficStore.setTo(val)
      }
    },
    realtimeEnabled () {
      return this.trafficStore.messagePolling
    },
    loadingFlag () {
      return !!this.trafficStore.isLoading
    },
    topOffset () {
      return this.hexSearchOpen ? '110px' : '80px'
    },
    hasActiveFilters () {
      const ef = this.eventFilter
      return !(ef.connect && ef.disconnect && ef.received && ef.sent) || this.connFilter !== null || this.hexSearchNormalized.length > 0
    },
    packetsFilter () {
      return { eventFilter: this.eventFilter, connFilter: this.connFilter, hexNeedle: this.hexSearchNormalized }
    },
    /* sent with every request, so the search covers the whole period rather than the loaded pages */
    serverFilter () {
      return buildPacketsFilter(this.packetsFilter)
    },
    /* the server filter for bytes is a superset of the exact match, every packet is checked here as well */
    filteredMessages () {
      if (!this.hasActiveFilters) return this.messages
      const filter = this.packetsFilter
      return this.messages.filter(packet => packetMatches(packet, filter, this.base64ToHex))
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
    dateRangeChangeHandler (range) {
      const from = range[0],
        to = range[1]
      if (this.from === from && this.to === to) { return false }
      this.from = from
      this.to = to
      if (this.realtimeEnabled) {
        this.trafficStore.removePollingGetMessages()
      }
      this.trafficStore.clearMessages()
      if (this.isCurrentDay(from, to)) {
        this.needAutoScroll = true
        this.trafficStore.getMessagesTail()
          .then(() => this.trafficStore.pollingGetMessages())
        return
      }
      /* a period picked by hand is shown from its beginning, even one that is still going on */
      this.needAutoScroll = false
      this.trafficStore.getMessages()
        .then(() => this.startPollingAtEnd(this.messages.length))
    },
    /*
     * The current day as a whole is the period the viewer opens with by itself (and the one the day
     * arrows lead back to), so it is shown from its end and follows the traffic as it comes.
     */
    isCurrentDay (from, to) {
      const now = Date.now()
      return from <= now && now < to && new Date(from).setHours(0, 0, 0, 0) === from && to - from >= 86399000
    },
    /*
     * Real time goes on from the last packet of the list, so it starts only once the list has reached
     * the present — a full page means there is more to load, and polling would have fetched all of it
     * in one request. Until then the next pages are loaded by scrolling down.
     */
    startPollingAtEnd (loadedCount) {
      if (this.to > Date.now() && !this.realtimeEnabled && loadedCount < this.currentLimit) {
        this.trafficStore.pollingGetMessages()
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
    clearSelected () {
      this.selected = []
    },
    /* the list is loaded again for the new filter, from the end of the period while it is still going on */
    async applyServerFilter (filter) {
      this.trafficStore.setFilter(filter)
      if (!this.isInit) { return }
      if (this.realtimeEnabled) {
        this.trafficStore.removePollingGetMessages()
      }
      this.trafficStore.clearMessages()
      this.selected = []
      if (this.to > Date.now()) {
        this.needAutoScroll = true
        await this.trafficStore.getMessagesTail()
        this.trafficStore.pollingGetMessages()
      } else {
        await this.trafficStore.getMessages()
      }
    },
    toggleEventFilter (key) {
      this.eventFilter[key] = !this.eventFilter[key]
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
      this.hexSearchNormalized = normalizeHex(val)
      this.$emit('hex-search', this.hexSearchNormalized)
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
      this.trafficStore.getMessagesPrev()
        .then((messages) => {
          if (messages && messages.length) {
            const newOffsetAll = scrollerElement.scrollHeight - scrollerElement.clientHeight
            scrollerElement.scrollTop = (newOffsetAll - offsetAll) + scrollTop
          }
        })
    },
    getMessagesNext () {
      this.trafficStore.getMessagesNext()
        .then(messages => { messages && this.startPollingAtEnd(messages.length) })
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
    closeDevice () {
      this.$emit('close')
    },
    clear () {
      if (this.realtimeEnabled) {
        this.trafficStore.removePollingGetMessages()
      }
      this.trafficStore.clearMessages()
      this.closeDevice()
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
      if (this.activeId && !this.trafficStore.active) {
        this.trafficStore.setActive(this.activeId)
      }
      if (this.device && !this.trafficStore.ident) {
        this.trafficStore.setIdent(this.device.ident)
      }
      const from = this.$route.query.from * 1000,
        to = this.$route.query.to * 1000,
        selectTime = this.$route.query.highlight || from
      /* a reload keeps the period in the route: the current day is still opened at its end */
      if (from && to && !this.$route.query.highlight && this.isCurrentDay(from, to)) {
        this.from = from
        this.to = to
        await this.trafficStore.getMessagesTail()
        await this.trafficStore.pollingGetMessages()
      } else if (from && to) {
        this.from = from
        this.to = to
        await this.trafficStore.getMessages()
        this.startPollingAtEnd(this.messages.length)
        this.$nextTick(() => this.highlightIncoming(selectTime))
      } else {
        await this.trafficStore.initTime()
        await this.trafficStore.getMessagesTail()
        /* the tail is the present already */
        if (this.to > Date.now()) {
          await this.trafficStore.pollingGetMessages()
        }
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
    serverFilter (filter) {
      this.applyServerFilter(filter)
    },
    activeId (val) {
      this.clear()
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
    /* the store outlives the component, its filter is not to carry over to a list opened afresh */
    this.trafficStore.setFilter('')
    this.$emit('hex-search', '')
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
  unmounted () {
    this.highlightConn(null)
    this.trafficStore.removePollingGetMessages()
    this.trafficStore.clearMessages()
    this.to = 0
    this.from = 0
  },
  mixins: [routerProcess, highlightMixin, convertMixin],
  components: { MessagesListItem, VirtualList, EmptyPane, MessageSkeleton, DateRangeModal, ExportModal }
}
</script>
