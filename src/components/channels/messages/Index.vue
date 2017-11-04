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
      @change:pagination-next="paginationNextChangeHandler"
      @change:mode="modeChange"
      @update:cols="updateColsHandler"
    >
      <messages-list-item slot="items" slot-scope="{item, index, actions, cols, etcVisible, actionsVisible, itemHeight, rowWidth}"
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
  import { date } from 'quasar-framework'
  import filterMessages from '../../../mixins/filterMessages'
  import MessagesListItem from './MessagesListItem.vue'

  export default {
    props: [
      'mode',
      'date',
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
        i18n: {},
        config: {
          needShowFilter: true,
          needShowMode: false,
          needShowPageScroll: 'right',
          needShowDate: false
        }
      }
    },
    computed: {
      messages: {
        get () {
          let messages = this.$store.state.channelsMessages.messages
          this.i18n.to = messages.length ? date.formatDate(this.from * 1000, 'HH:mm:ss') : 'Next'
          return this.filter ? this.filterMessages(this.filter, messages) : messages
        },
        set (val) {
          this.$store.commit(`channelsMessages/setMessages`, val)
        }
      },
      active: {
        get () {
          return this.$store.state.channelsMessages.active
        },
        async set (val) {
          this.$store.commit(`channelsMessages/setActive`, val)
          this.$store.commit(`channelsMessages/clearMessages`)
          await this.$store.dispatch(`channelsMessages/getCols`)
          await this.$store.dispatch(`channelsMessages/get`)
        }
      },
      cols: {
        get () {
          return this.$store.state.channelsMessages.cols
        },
        set (val) {
          this.$store.commit(`channelsMessages/setCols`, val)
        }
      },
      filter: {
        get () {
          return this.$store.state.channelsMessages.filter
        },
        set (val) {
          val ? this.$store.commit(`channelsMessages/setFilter`, val) : this.$store.commit(`channelsMessages/setFilter`, '')
        }
      },
      from: {
        get () {
          return this.$store.state.channelsMessages.from
        },
        set (val) {
          val ? this.$store.commit(`channelsMessages/setFrom`, val) : this.$store.commit(`channelsMessages/setFrom`, 0)
        }
      },
      to: {
        get () {
          return this.$store.state.channelsMessages.to
        },
        set (val) {
          val ? this.$store.commit(`channelsMessages/setTo`, val) : this.$store.commit(`channelsMessages/setTo`, 0)
        }
      },
      limit: {
        get () {
          return this.$store.state.channelsMessages.limit
        },
        set (val) {
          val ? this.$store.commit(`channelsMessages/setLimit`, val) : this.$store.commit(`channelsMessages/setLimit`, 1000)
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
      modeChange (val) {
        val = +val
        this.$store.commit(`channelsMessages/clearMessages`)
        this.$store.commit(`channelsMessages/setMode`, val)
        switch (val) {
          case 0: {
            this.$store.dispatch(`channelsMessages/get`)
            break
          }
          case 1: {
            this.$store.dispatch(`channelsMessages/pullingGet`, 2000)
            break
          }
        }
      },
      updateColsHandler (cols) {
        this.cols = cols
      },
      paginationNextChangeHandler () {
        this.$store.dispatch(`channelsMessages/get`)
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
      if (this.$store.state.channelsMessages.mode === null) {
        this.modeChange(this.mode)
        return false
      }
      await this.$store.dispatch('channelsMessages/get')
      await this.$store.dispatch('channelsMessages/pullingGet', 2000)
    },
    destroyed () {
      this.$store.commit('channelsMessages/clearTimer')
    },
    mixins: [filterMessages],
    components: { VirtualScrollList, MessagesListItem }
  }
</script>

<style>
</style>
