<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :date="from"
      :mode="mode"
      :viewConfig="viewConfig"
      :colsConfigurator="'toolbar'"
      :i18n="i18n"
      :filter="filter"
      :theme="theme"
      :title="'Messages'"
      :loading="loadingFlag"
      @change:filter="filterChangeHandler"
      @change:pagination-prev="paginationPrevChangeHandler"
      @change:pagination-next="paginationNextChangeHandler"
      @change:date="dateChangeHandler"
      @change:date-prev="datePrevChangeHandler"
      @change:date-next="dateNextChangeHandler"
      @change:mode="modeChange"
      @update:cols="updateColsHandler"
    >
      <messages-list-item slot="items" slot-scope="{item, index, actions, cols, etcVisible, actionsVisible, itemHeight, rowWidth}"
        :item="item"
        :key="`${JSON.stringify(item)}${index}`"
        :index="index"
        :actions="actions"
        :cols="cols"
        :itemHeight="itemHeight"
        :rowWidth="rowWidth"
        :etcVisible="etcVisible"
        :actionsVisible="actionsVisible"
        :selected="selected.includes(index)"
        @action="actionHandler"
        @item-click="itemClickHandler"
      />
    </virtual-scroll-list>
  </div>
</template>

<script>
import { VirtualScrollList, channelsMessagesModuleSerial } from 'qvirtualscroll'
import Vue from 'vue'
import { date, copyToClipboard } from 'quasar'
import filterMessages from '../../../mixins/filterMessages'
import MessagesListItem from './MessagesListItem.vue'
import range from 'lodash/range'

export default {
  props: [
    'mode',
    'item',
    'date',
    'activeId',
    'limit',
    'config'
  ],
  data () {
    return {
      theme: this.config.theme,
      i18n: {},
      viewConfig: this.config.viewConfig,
      actions: this.config.actions,
      moduleName: this.config.vuexModuleName
    }
  },
  computed: {
    messages: {
      get () {
        let messages = this.$store.state[this.moduleName].messages
        this.setTranslate(messages)
        return this.mode === 1 ? messages : this.filterMessages(this.filter, messages)
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
        let activeItem = this.$store.state.channels[val] || {}
        this.$set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        this.$store.commit(`${this.moduleName}/clearMessages`)
        await this.$store.dispatch(`${this.moduleName}/getCols`)
        if (this.$store.state[this.moduleName].mode === 0) {
          await this.$store.dispatch(`${this.moduleName}/initTime`)
          await this.$store.dispatch(`${this.moduleName}/get`)
        } else if (this.$store.state[this.moduleName].mode === 1) {
          this.$store.dispatch(`${this.moduleName}/pollingGet`)
        }
        if (this.$store.state[this.moduleName].mode === 1 && !this.item.deleted) {
          await this.$store.dispatch(`${this.moduleName}/getHistory`, 200)
        }
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
    selected: {
      get () {
        return this.$store.state[this.moduleName].selected
      },
      set (val) {
        this.$store.commit(`${this.moduleName}/setSelected`, val)
      }
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
    setTranslate (messages) {
      this.i18n.from = messages.length ? `Previous batch until ${date.formatDate(messages[0].timestamp * 1000, 'HH:mm:ss')}` : 'Prev'
      this.i18n.to = messages.length ? `Next batch from ${date.formatDate(messages[messages.length - 1].timestamp * 1000, 'HH:mm:ss')}` : 'Next'
    },
    async modeChange (val) {
      let modeInitValueIsNull = this.$store.state[this.moduleName].mode === null
      await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active device */
      val = +val
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.commit(`${this.moduleName}/setMode`, val)
      if (val === 1 && this.active && this.$store.state[this.moduleName].mode !== null) {
        await this.$store.dispatch(`${this.moduleName}/getHistory`, 200)
        await this.$store.dispatch(`${this.moduleName}/pollingGet`)
      }
      if (val === 0 && this.active && (!this.item.deleted || modeInitValueIsNull)) {
        await this.$store.dispatch(`${this.moduleName}/initTime`) // if need init time by last messages
        await this.$store.dispatch(`${this.moduleName}/get`)
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    dateChangeHandler (date) {
      let to = new Date(date).setHours(0, 0, 0, 0)
      to += 86400000
      this.$store.commit(`${this.moduleName}/setTo`, to)
      this.$store.dispatch(`${this.moduleName}/get`, { name: 'setFrom', payload: date })
    },
    datePrevChangeHandler () {
      this.$store.dispatch(`${this.moduleName}/get`, { name: 'datePrev' })
    },
    dateNextChangeHandler () {
      this.$store.dispatch(`${this.moduleName}/get`, { name: 'dateNext' })
    },
    paginationPrevChangeHandler () {
      let timestamp = 0
      timestamp = this.messages.length ? this.messages[0].timestamp * 1000 : 0
      this.$store.dispatch(`${this.moduleName}/get`, { name: 'paginationPrev', payload: timestamp })
    },
    paginationNextChangeHandler () {
      let timestamp = 0
      timestamp = this.messages.length ? this.messages[this.messages.length - 1].timestamp * 1000 : 0
      this.$store.dispatch(`${this.moduleName}/get`, { name: 'paginationNext', payload: timestamp })
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
      let messages = this.messages.reduce((messages, message, index) => {
        let includes = this.selected.includes(index)
        if (includes) {
          let modifiedMessage = Object.keys(message).reduce((result, key) => {
            if (
              key === 'delimiter' ||
              key === '__status' ||
              key === 'x-flespi-filter-fields' ||
              key === 'x-flespi-filter-next' ||
              key === 'x-flespi-filter-prev'
            ) {
              return result
            }
            result[key] = message[key]
            return result
          }, {})
          messages.push(modifiedMessage)
        }
        return messages
      }, [])
      this.$emit('view-data', messages)
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
    }
  },
  watch: {
    activeId (val) {
      this.active = val
    },
    mode (mode) {
      this.modeChange(mode)
    },
    limit (limit) {
      this.currentLimit = limit
    }
  },
  created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(this.moduleName, channelsMessagesModuleSerial({ Vue, LocalStorage: this.$q.localStorage, name: this.moduleName, errorHandler: (err) => { this.$store.commit('reqFailed', err) }, filterHandler: this.filterMessages }))
    } else {
      this.$store.commit(`${this.moduleName}/clear`)
    }
    this.currentLimit = this.limit
    if (this.activeId) {
      this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
      let activeItem = this.$store.state.channels[this.activeId] || {}
      Vue.set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
      this.$store.dispatch(`${this.moduleName}/getCols`)
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
  components: { VirtualScrollList, MessagesListItem }
}
</script>

<style>
</style>
