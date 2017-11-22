<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="[]"
      :items="messages"
      :date="from"
      :mode="mode"
      :needShowMode="config.needShowMode"
      :needShowPageScroll="config.needShowPageScroll"
      :needShowDate="config.needShowDate"
      :needShowFilter="config.needShowFilter"
      :colsConfigurator="'toolbar'"
      :i18n="i18n"
      :filter="filter"
      :theme="theme"
      @change:filter="filterChangeHandler"
      @change:pagination-prev="paginationPrevChangeHandler"
      @change:pagination-next="paginationNextChangeHandler"
      @change:date="dateChangeHandler"
      @change:date-prev="datePrevChangeHandler"
      @change:date-next="dateNextChangeHandler"
      @change:mode="modeChange"
      @update:cols="updateColsHandler"
    >
      <logs-list-item slot="items" slot-scope="{item, index, actions, cols, etcVisible, actionsVisible, itemHeight, rowWidth}"
          :item="item"
          :key="index"
          :index="index"
          :actions="actions"
          :cols="cols"
          :itemHeight="itemHeight"
          :rowWidth="rowWidth"
          :etcVisible="etcVisible"
      />
    </virtual-scroll-list>
  </div>
</template>

<script>
  import { VirtualScrollList } from 'qvirtualscroll'
  import LogsListItem from './LogsListItem.vue'
  import { date, LocalStorage } from 'quasar-framework'
  import filterMessages from '../../../mixins/filterMessages'

  export default {
    props: [
      'mode',
      'activeId',
      'delay',
      'limit',
      'moduleName'
    ],
    data () {
      return {
        theme: {
          color: 'white',
          bgColor: 'dark',
          contentInverted: true,
          controlsInverted: true
        },
        i18n: {
          'Messages not found': 'Log entries not found'
        },
        config: {
          needShowFilter: true,
          needShowMode: false,
          needShowPageScroll: 'right left',
          needShowDate: true
        }
      }
    },
    computed: {
      messages: {
        get () {
          let messages = this.$store.state[this.moduleName].messages
          this.i18n.from = messages.length ? date.formatDate(messages[0].time * 1000, 'HH:mm:ss') : 'Prev'
          this.i18n.to = messages.length ? date.formatDate(messages[messages.length - 1].time * 1000, 'HH:mm:ss') : 'Next'
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
          this.$store.commit(`${this.moduleName}/setActive`, val)
          this.$store.commit(`${this.moduleName}/clearMessages`)
          await this.$store.dispatch(`${this.moduleName}/getCols`)
          if (this.mode === 0) {
            await this.$store.dispatch(`${this.moduleName}/initTime`)
          }
          await this.$store.dispatch(`${this.moduleName}/get`)
        }
      },
      cols: {
        get () {
          return this.$store.state[this.moduleName].cols
        },
        set (val) {
          this.$store.commit(`${this.moduleName}/setCols`, val)
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
        val = +val
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.$store.commit(`${this.moduleName}/setMode`, val)
        switch (val) {
          case 0: {
            if (this.active) {
              this.$store.dispatch(`${this.moduleName}/initTime`) // if need init time by last messages
                .then(() => {
                  this.$store.dispatch(`${this.moduleName}/get`)
                })
            }
            break
          }
          case 1: {
            if (this.active) {
              this.$store.dispatch(`${this.moduleName}/pollingGet`, this.delay)
            }
            break
          }
        }
        LocalStorage.set('Toolbox-mode', val)
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
        let time = 0
        time = this.messages.length ? this.messages[0].time * 1000 : 0
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'paginationPrev', payload: time})
      },
      paginationNextChangeHandler () {
        let time = 0
        time = this.messages.length ? this.messages[this.messages.length - 1].time * 1000 : 0
        this.$store.dispatch(`${this.moduleName}/get`, {name: 'paginationNext', payload: time})
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
      },
      delay (delay) {
        if (this.mode === 1) {
          this.$store.dispatch(`${this.moduleName}/pollingGet`, delay)
        }
      }
    },
    async created () {
      this.currentLimit = this.limit
      if (this.$store.state[this.moduleName].mode === null) {
        this.modeChange(this.mode)
      }
      if (this.activeId) { this.active = this.activeId }
    },
    destroyed () {
      this.$store.commit(`${this.moduleName}/clearTimer`)
    },
    mixins: [filterMessages],
    components: { VirtualScrollList, LogsListItem }
  }
</script>

<style>
</style>
