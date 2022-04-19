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
      <div v-if="loadingFlag && itemsCount > 0" class="absolute-bottom-right absolute-top-left" style="overflow: hidden; top: 50px;">
        <message-skeleton v-for="(_, index) in new Array(itemsCount).fill('')" :key="index"/>
      </div>
      <template v-else-if="!loadingFlag && messages.length">
        <VirtualList
          :onscroll="listScroll"
          ref="scroller"
          :style="{position: 'absolute', top: '50px', bottom: 0, right: 0, left: 0, height: 'auto'}"
          :class="{'bg-grey-9': true, 'text-white': true, 'cursor-pointer': true}"
          :size="itemHeight"
          :remain="itemsCount"
          wclass="q-w-list"
        >
          <messages-list-item
            v-for="(item, index) in messages"
            :key="index"
            :item="item"
            :index="index"
            :actions="actions"
            :itemHeight="itemHeight"
            :selected="selected.includes(index)"
            :view="view"
            @action="actionHandler"
            @item-click="messageClickHandler"
            @mouseenter.native="highlightConn(item.conn)"
            @mouseleave.native="highlightConn(null)"
          />
        </VirtualList>
      </template>
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
      isInit: false
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
      this.$emit('view-data', this.selected.map(index => ({ ...this.messages[index], index })))
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
      const incomingMessageIndex = this.messages.findIndex(message => isTypeDataReceive(message.type))
      const incomingMessageIndexEnd = this.messages.findIndex(message => isTypeDataReceive(message.type) && Math.floor(message.timestamp) === Math.floor(timestamp)) // Math.floor((this.to / 1000) - 1)) getting timestamp in seconds for related entity
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
  mixins: [routerProcess, highlightMixin],
  components: { MessagesListItem, VirtualList, EmptyPane, MessageSkeleton, DateRangeModal, ExportModal }
}
</script>
