<template>
  <div>
    <virtual-scroll-list
      ref="scrollList"
      :cols="cols"
      :actions="actions"
      :items="messages"
      :date="from"
      :mode="mode"
      :viewConfig="config"
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
      />
    </virtual-scroll-list>
  </div>
</template>

<script>
  import { VirtualScrollList } from 'qvirtualscroll'
  import { date, Toast, LocalStorage } from 'quasar-framework'
  import filterMessages from '../../../mixins/filterMessages'
  import MessagesListItem from './MessagesListItem.vue'

  export default {
    props: [
      'mode',
      'date',
      'activeId',
      'limit',
      'moduleName'
    ],
    data () {
      return {
        selectedItemKey: null,
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
        },
        actions: [
          {
            icon: 'mdi-view-list',
            label: 'view',
            classes: '',
            type: 'view'
          },
          {
            icon: 'mdi-content-copy',
            label: 'copy',
            classes: '',
            type: 'copy'
          }
        ]
      }
    },
    computed: {
      messages: {
        get () {
          let messages = this.$store.state[this.moduleName].messages
          this.i18n.to = messages.length ? date.formatDate(this.from * 1000, 'HH:mm:ss') : 'Next'
          return this.filter ? this.filterMessages(this.filter, messages) : messages
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
          await this.$store.dispatch(`${this.moduleName}/getCols`)
          this.modeChange(this.mode)
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
        }
      },
      modeChange (val) {
        val = +val
        this.$store.commit(`${this.moduleName}/clearMessages`)
        this.$store.commit(`${this.moduleName}/setMode`, val)
        LocalStorage.set('Toolbox-mode', val)
        switch (val) {
          case 0: {
            if (this.active) {
              this.$store.dispatch(`${this.moduleName}/get`)
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
      this.currentLimit = this.limit
      if (this.activeId) {
        this.$store.commit(`${this.moduleName}/setActive`, this.activeId)
        await this.$store.dispatch(`${this.moduleName}/getCols`)
      }
      if (this.$store.state[this.moduleName].mode === null) {
        this.modeChange(this.mode)
      }
    },
    destroyed () {
      this.$store.commit(`${this.moduleName}/clear`)
    },
    mixins: [filterMessages],
    components: { VirtualScrollList, MessagesListItem }
  }
</script>

<style>
</style>
