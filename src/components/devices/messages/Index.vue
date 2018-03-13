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
         :selected="`${JSON.stringify(item)}${index}` === selectedItemKey"
         @action="actionHandler"
         @item-click="viewMessagesHandler"
      />
    </virtual-scroll-list>
  </div>
</template>

<script>
  import { VirtualScrollList, devicesMessagesModule } from 'qvirtualscroll'
  import Vue from 'vue'
  import { date, LocalStorage, Toast } from 'quasar-framework'
  import filterMessages from '../../../mixins/filterMessages'
  import MessagesListItem from './MessagesListItem.vue'

  export default {
    props: [
      'mode',
      'activeId',
      'limit',
      'config'
    ],
    data () {
      return {
        selectedItemKey: null,
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
          this.i18n.from = messages.length ? `Previous batch until ${date.formatDate(messages[0].timestamp * 1000, 'HH:mm:ss')}` : 'Prev'
          this.i18n.to = messages.length ? `Next batch from ${date.formatDate(messages[messages.length - 1].timestamp * 1000, 'HH:mm:ss')}` : 'Next'
          return this.filter && this.mode === 1 ? this.filterMessages(this.filter, messages) : messages
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
          this.$store.commit(`${this.moduleName}/clearMessages`)
          await this.$store.dispatch(`${this.moduleName}/getCols`)
          if (this.$store.state[this.moduleName].mode === 0) {
            await this.$store.dispatch(`${this.moduleName}/initTime`)
            await this.$store.dispatch(`${this.moduleName}/get`)
          }
          this.$store.dispatch(`${this.moduleName}/pollingGet`)
          if (this.$store.state[this.moduleName].mode === 1 && !this.item.deleted) {
            await this.$store.dispatch(`${this.moduleName}/getHistory`)
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
      modeChange (val) {
        let modeInitValueIsNull = this.$store.state[this.moduleName].mode === null
        val = +val
        this.$store.commit(`${this.moduleName}/clearMessages`)
        if (val === 1 && this.active && this.$store.state[this.moduleName].mode !== null) {
          this.$store.dispatch(`${this.moduleName}/getHistory`, 200)
        }
        this.$store.commit(`${this.moduleName}/setMode`, val)
        if (val === 0 && this.active && (!this.item.deleted || modeInitValueIsNull)) {
          this.$store.dispatch(`${this.moduleName}/initTime`) // if need init time by last messages
            .then(() => {
              this.$store.dispatch(`${this.moduleName}/get`)
            })
        }
      },
      updateColsHandler (cols) {
        this.cols = cols
      },
      dateChangeHandler (date) {
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'setDate', payload: date})
      },
      datePrevChangeHandler () {
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'datePrev'})
      },
      dateNextChangeHandler () {
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'dateNext'})
      },
      paginationPrevChangeHandler () {
        let timestamp = 0
        timestamp = this.messages.length ? this.messages[0].timestamp * 1000 : 0
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'paginationPrev', payload: timestamp})
      },
      paginationNextChangeHandler () {
        let timestamp = 0
        timestamp = this.messages.length ? this.messages[this.messages.length - 1].timestamp * 1000 : 0
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'paginationNext', payload: timestamp})
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
        this.selectedItemKey = `${JSON.stringify(content)}${index}`
        this.$emit('view-data', content)
      },
      copyMessageHandler ({index, content}) {
        this.$copyText(JSON.stringify(content)).then(function (e) {
          Toast.create.positive({
            icon: 'content_copy',
            html: `Message copied`,
            timeout: 1000
          })
        }, function (e) {
          Toast.create.negative({
            icon: 'content_copy',
            html: `Error coping messages`,
            timeout: 1000
          })
        })
      },
      unselect () {
        if (this.selectedItemKey) {
          this.selectedItemKey = null
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
        this.$store.registerModule(this.moduleName, devicesMessagesModule(this.$store, Vue, LocalStorage, this.moduleName))
      }
      else {
        this.$store.commit(`${this.moduleName}/clear`)
      }
      this.currentLimit = this.limit
      if (this.activeId) {
        this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
        await this.$store.dispatch(`${this.moduleName}/getCols`)
      }
      if (this.$store.state[this.moduleName].mode === null) {
        this.modeChange(this.mode)
        this.$store.dispatch(`${this.moduleName}/pollingGet`)
        if (this.mode === 1) {
          await this.$store.dispatch(`${this.moduleName}/getHistory`)
        }
      }
      Vue.connector.socket.on('offline', () => { this.$store.commit(`${this.moduleName}/setOffline`, this.mode === 1) })
      Vue.connector.socket.on('connect', () => {
        if (this.$store.state[this.moduleName].offline) {
          this.$store.commit(`${this.moduleName}/setReconnected`, this.mode === 1)
          if (this.mode === 1) {
            this.$store.dispatch(`${this.moduleName}/getMissedMessages`)
          }
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
