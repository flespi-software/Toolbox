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
  import { date } from 'quasar-framework'
  import filterMessages from '../../../mixins/filterMessages'

  export default {
    props: [
      'mode',
      'activeId'
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
          let messages = this.$store.state.channelsLogs.messages
          this.i18n.from = messages.length ? date.formatDate(messages[0].time * 1000, 'HH:mm:ss') : 'Prev'
          this.i18n.to = messages.length ? date.formatDate(messages[messages.length - 1].time * 1000, 'HH:mm:ss') : 'Next'
          return this.filter && this.mode === 1 ? this.filterMessages(this.filter, messages) : messages
        },
        set (val) {
          this.$store.commit(`channelsLogs/setMessages`, val)
        }
      },
      active: {
        get () {
          return this.$store.state.channelsLogs.active
        },
        async set (val) {
          this.$store.commit(`channelsLogs/setActive`, val)
          this.$store.commit(`channelsLogs/clearMessages`)
          await this.$store.dispatch(`channelsLogs/getCols`)
          if (this.mode === 0) {
            await this.$store.dispatch(`channelsLogs/initTime`)
          }
          await this.$store.dispatch(`channelsLogs/get`)
        }
      },
      cols: {
        get () {
          return this.$store.state.channelsLogs.cols
        },
        set (val) {
          this.$store.commit(`channelsLogs/setCols`, val)
        }
      },
      filter: {
        get () {
          return this.$store.state.channelsLogs.filter
        },
        set (val) {
          val ? this.$store.commit(`channelsLogs/setFilter`, val) : this.$store.commit(`channelsLogs/setFilter`, '')
        }
      },
      from: {
        get () {
          return this.$store.state.channelsLogs.from
        },
        set (val) {
          val ? this.$store.commit(`channelsLogs/setFrom`, val) : this.$store.commit(`channelsLogs/setFrom`, 0)
        }
      },
      to: {
        get () {
          return this.$store.state.channelsLogs.to
        },
        set (val) {
          val ? this.$store.commit(`channelsLogs/setTo`, val) : this.$store.commit(`channelsLogs/setTo`, 0)
        }
      },
      reverse: {
        get () {
          return this.$store.state.channelsLogs.reverse || false
        },
        set (val) {
          this.$store.commit(`channelsLogs/setReverse`, val)
        }
      },
      limit: {
        get () {
          return this.$store.state.channelsMessages.limit
        },
        set (val) {
          val ? this.$store.commit(`channelsLogs/setLimit`, val) : this.$store.commit(`channelsLogs/setLimit`, 1000)
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
            this.$store.commit(`channelsLogs/clearMessages`)
            this.$store.dispatch(`channelsLogs/get`)
          }
        }
      },
      modeChange (val) {
        val = +val
        this.$store.commit(`channelsLogs/clearMessages`)
        this.$store.commit(`channelsLogs/setMode`, val)
        switch (val) {
          case 0: {
            this.$store.dispatch(`channelsLogs/initTime`) // if need init time by last messages
              .then(() => {
                this.$store.dispatch(`channelsLogs/get`)
              })
            break
          }
          case 1: {
            this.$store.dispatch(`channelsLogs/pullingGet`, 2000)
            break
          }
        }
      },
      updateColsHandler (cols) {
        this.cols = cols
      },
      dateChangeHandler (date) {
        this.$store.dispatch(`channelsLogs/get`, {name: 'setDate', payload: date})
      },
      datePrevChangeHandler () {
        this.$store.dispatch(`channelsLogs/get`, {name: 'datePrev'})
      },
      dateNextChangeHandler () {
        this.$store.dispatch(`channelsLogs/get`, {name: 'dateNext'})
      },
      paginationPrevChangeHandler () {
        let time = 0
        time = this.messages.length ? this.messages[0].time * 1000 : 0
        this.$store.dispatch(`channelsLogs/get`, {name: 'paginationPrev', payload: time})
      },
      paginationNextChangeHandler () {
        let time = 0
        time = this.messages.length ? this.messages[this.messages.length - 1].time * 1000 : 0
        this.$store.dispatch(`channelsLogs/get`, {name: 'paginationNext', payload: time})
      }
    },
    watch: {
      activeId (val) {
        this.active = val
      },
      mode (mode) {
        this.modeChange(mode)
      }
    },
    async created () {
      if (this.activeId) { this.active = this.activeId }
      if (this.$store.state.channelsLogs.mode === null) {
        this.modeChange(this.mode)
        return false
      }
      this.$store.commit('channelsLogs/setTo', Date.now())
      await this.$store.dispatch('channelsLogs/get')
      this.$store.commit('channelsLogs/setFrom', this.$store.state.channelsLogs.to - 4000 - 1000)
      this.$store.commit('channelsLogs/setTo', this.$store.state.channelsLogs.to - 4000)
      await this.$store.dispatch('channelsLogs/pullingGet', 2000)
    },
    destroyed () {
      this.$store.commit('channelsLogs/clearTimer')
    },
    mixins: [filterMessages],
    components: { VirtualScrollList, LogsListItem }
  }
</script>

<style>
</style>
