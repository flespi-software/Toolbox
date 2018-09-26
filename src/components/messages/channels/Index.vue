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
      @change:filter="filterChangeHandler"
      @change:pagination-next="paginationNextChangeHandler"
      @change:mode="modeChange"
      @update:cols="updateColsHandler"
      @change:date="dateChangeHandler"
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
import { VirtualScrollList, channelsMessagesModule } from 'qvirtualscroll'
import Vue from 'vue'
import { date } from 'quasar'
import filterMessages from '../../../mixins/filterMessages'
import MessagesListItem from './MessagesListItem.vue'
import range from 'lodash/range'

export default {
  props: [
    'mode',
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
        this.setTranslation(messages)
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
        await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)/* remove subscription for previous active channel */
        this.$store.commit(`${this.moduleName}/setActive`, val)
        let activeItem = this.$store.state.items.filter((item) => { return val === item.id })[0] || {}
        Vue.set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
        await this.$store.dispatch(`${this.moduleName}/getCols`)
        this.modeChange(this.mode)
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
    from: {
      get () {
        let module = this.$store.state[this.moduleName]
        return module.messages[0] && module.messages[0].timestamp ? Math.ceil(module.messages[0].timestamp * 1000) : Date.now()
      },
      set (val) {
        val ? this.$store.commit(`${this.moduleName}/setFrom`, Math.ceil(val / 1000)) : this.$store.commit(`${this.moduleName}/setFrom`, 0)
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.$store.dispatch(`${this.moduleName}/get`)
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
    }
  },
  methods: {
    resetParams () {
      this.$refs.scrollList.resetParams()
    },
    filterChangeHandler (val) {
      if (this.filter !== val) {
        this.filter = val
      }
    },
    setTranslation (messages) {
      this.i18n.to = messages.length ? `Next batch from ${date.formatDate(this.from * 1000, 'HH:mm:ss')}` : 'Next'
    },
    dateChangeHandler (date) {
      this.from = date
    },
    modeChange (val) {
      val = +val
      this.$store.commit(`${this.moduleName}/clearMessages`)
      this.$store.commit(`${this.moduleName}/setMode`, val)
      switch (val) {
        case 0: {
          if (this.active) {
            this.$store.dispatch(`${this.moduleName}/get`)
          }
          break
        }
      }
    },
    updateColsHandler (cols) {
      this.cols = cols
    },
    paginationNextChangeHandler () {
      this.$store.dispatch(`${this.moduleName}/get`)
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
      this.$emit('view-data', this.messages.filter((message, index) => this.selected.includes(index)))
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
  async created () {
    if (!this.$store.state[this.moduleName]) {
      this.$store.registerModule(this.moduleName, channelsMessagesModule({Vue, LocalStorage: this.$q.localStorage, name: this.moduleName, errorHandler: (err) => { this.$store.commit('reqFailed', err) }, filterHandler: this.filterMessages}))
    } else {
      this.$store.commit(`${this.moduleName}/clear`)
    }
    this.currentLimit = this.limit
    if (this.activeId) {
      this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
      let activeItem = this.$store.state.items.filter((item) => { return this.activeId === item.id })[0] || {}
      Vue.set(this.config.viewConfig, 'needShowEtc', activeItem.protocol_name && (activeItem.protocol_name === 'http' || activeItem.protocol_name === 'mqtt'))
      await this.$store.dispatch(`${this.moduleName}/getCols`)
    }
    if (this.$store.state[this.moduleName].mode === null) {
      this.modeChange(this.mode)
      this.$store.dispatch(`${this.moduleName}/pollingGet`)
    }
    Vue.connector.socket.on('offline', () => {
      if (this.mode === 1) {
        this.$store.commit(`${this.moduleName}/setOffline`, this.mode === 1)
        this.$store.commit('setSocketOffline', true)
      }
    })
    Vue.connector.socket.on('connect', () => {
      if (this.$store.state[this.moduleName].offline) {
        this.$store.commit(`${this.moduleName}/setReconnected`, this.mode === 1)
        this.$store.commit('setSocketOffline', false)
      }
    })
  },
  destroyed () {
    Vue.connector.socket.off('offline')
    Vue.connector.socket.off('connect')
    this.$store.commit(`${this.moduleName}/clear`)
  },
  mixins: [filterMessages],
  components: { VirtualScrollList, MessagesListItem }
}
</script>

<style>
</style>
