<template>
  <q-page>
    <q-toolbar class="justify-between bg-grey-9">
      <div style="max-width: 40%;" class="flex" :class="{'middle-modificator': !active}" v-if="items.length">
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          filled
          :label="active ? 'Channel' : 'SELECT CHANNEL'"
          dark hide-bottom-space dense color="white"
          :disable="!isNeedSelect"
          :virtual-scroll-item-size="60"
          :virtual-scroll-slice-size="6"
          :virtual-scroll-sticky-size-start="48"
          :virtual-scroll-sticky-size-end="needShowGetDeletedAction && tokenType === 1 ? 29 : 0"
          popup-content-class="items__popup"
          :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 60) + (needShowGetDeletedAction && tokenType === 1 ? 77 : 48)}px`}"
          @filter="filterItems"
        >
          <div slot="before-options" class="bg-dark q-pa-xs select__filter">
            <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" autofocus>
              <q-icon slot="prepend" name="mdi-magnify" color="white" />
            </q-input>
          </div>
          <div slot="after-options" class="select__get-deleted" v-if="needShowGetDeletedAction && tokenType === 1">
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler">see deleted</q-btn>
          </div>
          <template v-slot:no-option>
            <div>
              <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" class="q-ma-xs" autofocus>
                <q-icon slot="prepend" name="mdi-magnify" color="white" />
              </q-input>
              <div class="text-center">No results</div>
            </div>
          </template>
          <template v-slot:selected-item="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              class="q-pa-none"
              style="min-height: 20px; margin-top: 2px; max-width: 100%"
            >
              <q-item-section>
                <q-item-label header class="ellipsis overflow-hidden q-pa-none text-white">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-white ellipsis" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{selectedItem.uri || '&lt;no uri&gt;'}}</small></q-item-label>
              </q-item-section>
              <q-item-section class="text-white" side>
                <q-item-label v-if="selectedItem.deleted" class="q-pa-none text-right"><small class="cheap-modifier">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope" v-if="filteredItems.length">
            <q-item
              v-bind="scope.itemProps"
              @click="active = scope.opt.id, $emit('view-data-hide')"
              v-on="scope.itemEvents"
              :class="{'text-grey-8': scope.opt.deleted}"
              class="q-pa-xs"
              clickable
            >
              <q-item-section>
                <q-item-label header class="ellipsis overflow-hidden q-pa-xs">{{scope.opt.name || '&lt;noname&gt;'}}</q-item-label>
                <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{(protocols && protocols[scope.opt.protocol_id]) || '&lt;no protocol&gt;'}}</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.uri || '&lt;no uri&gt;'}}</small></q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{scope.opt.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp" v-if="$q.platform.is.desktop">
          <q-btn title="View hex payload" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" v-if="selectedItem && selectedItem.protocol_id === proxyProtocolId" @click="hexViewHandler" flat dense style="width: 50px;">
            <q-icon size="1.5rem" color="white" name="mdi-matrix"/>
            <div style="font-size: .7rem; line-height: .7rem">HEX</div>
          </q-btn>
        </transition>
      </div>
      <div v-if="active">
        <q-btn v-if="!selectedItem.deleted" flat dense class="on-right pull-right text-center rounded-borders q-px-xs q-py-none" color="white" @click="modeModel = !modeModel" style="min-width: 70px; max-width: 70px;">
          <q-icon size="1.5rem" color="white" :name="modeModel ? 'playlist_play' : 'history'"/>
          <div style="font-size: .7rem; line-height: .7rem">{{modeModel ? 'Real-time' : 'History'}}</div>
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
        </q-btn>
        <q-btn-toggle
          v-if="!selectedItem.deleted"
          dense
          color="grey-8"
          toggle-color="white"
          toggle-text-color="grey-9"
          class="q-ml-sm gt-xs" size="sm"
          v-model="ratio"
          :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
        />
        <q-btn class="lt-sm text-white" dense size="sm">
          {{ratio === 50 ? 'both' : (ratio === 0 ? 'messages' : 'logs')}}
          <q-menu style="background-color: transparent">
            <q-btn-toggle
              v-close-popup
              v-if="!selectedItem.deleted"
              dense
              color="grey-8"
              toggle-color="white"
              toggle-text-color="grey-9"
              size="sm"
              v-model="ratio"
              :options="[{label: 'logs', value: 100},{label: 'both', value: 50},{label: 'messages', value: 0}]"
            />
          </q-menu>
        </q-btn>
      </div>
      <div v-if="active && $q.platform.is.desktop" class="flex" style="width: 46px;">
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="Clear all panes" class="on-left pull-right text-center q-py-none text-white" v-if="modeModel && !isEmptyMessages" @click="clearHandler" flat dense style="width: 60px">
            <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
            <div style="font-size: .7rem; line-height: .7rem">Clear</div>
          </q-btn>
        </transition>
      </div>
      <div v-else-if="active && !$q.platform.is.desktop && ((selectedItem && selectedItem.protocol_id === proxyProtocolId) || (modeModel && !isEmptyMessages))">
        <q-btn flat icon="mdi-dots-vertical" color="white">
          <q-menu>
            <q-list>
              <q-item v-close-popup v-if="selectedItem && selectedItem.protocol_id === proxyProtocolId" @click="hexViewHandler" clickable>
                <q-item-section avatar>
                  <q-icon name="mdi-matrix" />
                </q-item-section>
                <q-item-section>Hex</q-item-section>
              </q-item>
              <q-item v-close-popup @click="clearHandler" v-if="modeModel && !isEmptyMessages" clickable>
                <q-item-section avatar>
                  <q-icon name="mdi-playlist-remove" />
                </q-item-section>
                <q-item-section>Clear</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
    <div v-if="isInit && active">
      <logs
        ref="logs"
        :mode="mode"
        :item="selectedItem"
        :limit="limit"
        :isEnabled="!!+size[0]"
        originPattern="gw/channels/:id"
        :config="config.logs"
        v-if="+size[0]"
        :style="{minHeight: `calc(${size[0]}vh - ${+size[1] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
      <messages
        ref="messages"
        @view-data="viewDataHandler"
        :mode="mode"
        :item="selectedItem"
        :activeId="active"
        :isEnabled="!!+size[1]"
        :limit="limit"
        :config="config.messages"
        v-if="+size[1]"
        :style="{minHeight: `calc(${size[1]}vh - ${+size[0] ? isVisibleToolbar ? '50px' : '25px' : isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
      />
    </div>
    <div v-if="!items.length" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Channels not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import messages from '../../components/messages/channels/Index.vue'
import { mapState, mapActions } from 'vuex'
// import VirtualList from 'vue-virtual-scroll-list'
import init from '../../mixins/entitiesInit'

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
  mixins: [init],
  data () {
    return {
      filter: '',
      mode: 1,
      active: null,
      ratio: 50,
      isInit: false,
      needShowGetDeletedAction: true
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        let hasntMessages = this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length && this.ratio !== 100,
          hasntLogs = this.config.logs && state[this.config.logs.vuexModuleName] && state[this.config.logs.vuexModuleName].messages && !state[this.config.logs.vuexModuleName].messages.length && this.ratio !== 0
        return hasntMessages && hasntLogs
      },
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      protocols (state) { return state.protocols },
      itemsCollection (state) {
        return state.items
      },
      items (state) {
        return Object.values(state.items)
      },
      proxyProtocolId (state) {
        let protocols = state.protocols
        return Object.keys(protocols).reduce((res, id) => {
          if (protocols[id] === 'proxy') {
            res = parseInt(id)
          }
          return res
        }, 0)
      }
    }),
    filteredItems () {
      let filter = this.filter.toLowerCase()
      let filteredItems = this.filter ? this.items.filter(item => {
        return (
          item &&
          typeof item.name !== 'undefined' &&
          item.name !== null &&
          item.name.toLowerCase().indexOf(filter) >= 0
        ) ||
        (
          item &&
          typeof item.id !== 'undefined' &&
          item.id !== null &&
          (item.id + '').indexOf(filter) >= 0
        )
      }) : this.items
      filteredItems.sort((l, r) => {
        if (!l.name) { return -1 }
        if (!r.name) { return 1 }
        let lName = l.name.toLowerCase()
        let rName = r.name.toLowerCase()
        if (lName < rName) {
          return -1
        } else if (lName > rName) {
          return 1
        }
        return 1
      })
      return filteredItems
    },
    size () {
      return [this.ratio, 100 - this.ratio]
    },
    selectedItem () {
      let item = this.itemsCollection[this.active] || null
      if (item && item.deleted) {
        this.deletedHandler()
      }
      return item
    },
    modeModel: {
      get () {
        return !!this.mode
      },
      set (val) {
        let now = Date.now()
        this.date = val ? 0 : now - (now % 86400000)
        this.mode = Number(val)
        this.$emit('view-data-hide')
      }
    }
  },
  methods: {
    ...mapActions(['getDeleted']),
    filterItems (filter, update) {
      update()
    },
    viewDataHandler (content) {
      this.$emit('view-data', content[content.length - 1])
    },
    viewLogMessagesHandler (content) {
      this.$emit('view-log-message', content)
    },
    hexViewHandler () {
      this.$router.push(`/tools/hex/${this.active}`).catch(err => err)
    },
    unselect () {
      this.$refs.messages.unselect()
    },
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true
      }).onOk(() => {
        this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`)
        this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
      })
        .onCancel(() => {})
    },
    selectReset () {
      this.$refs.itemSelect && this.$refs.itemSelect.reset()
    },
    async getDeletedHandler () {
      await this.getDeleted('channels')
      this.needShowGetDeletedAction = false
      this.selectReset()
    },
    clearActive () {
      this.active = null
    },
    deletedHandler () {
      this.ratio = 100
      this.mode = 0
    },
    init () {
      let entity = 'channels',
        activeFromLocaleStorage = this.$q.localStorage.getItem(entity),
        idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      this.isInit = true
      if (idFromRoute) {
        if (this.itemsCollection[idFromRoute]) {
          this.active = idFromRoute
        } else {
          this.active = null
        }
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        this.active = activeFromLocaleStorage
      }
      // deleted item logic
      if (this.selectedItem && this.selectedItem.deleted) {
        this.deletedHandler()
      }
    }
  },
  watch: {
    ratio (val) {
      this.$nextTick(() => {
        if (+this.size[0] && this.active) {
          this.$refs.logs.resetParams()
          this.$emit('view-data-hide')
        }
        if (+this.size[1] && this.active) {
          this.$refs.messages.resetParams()
        }
      })
    },
    $route (route) {
      if (route.params && route.params.id) {
        let id = Number(route.params.id)
        if (this.itemsCollection[id]) {
          this.active = Number(route.params.id)
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      let currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$q.localStorage.set('channels', val)
        this.$router.push(`/channels/${val}`).catch(err => err)
      } else {
        this.$router.push('/channels').catch(err => err)
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      } else {
        this.ratio = currentItem.deleted ? 100 : 50
      }
    }
  },
  components: { logs, messages }
}
</script>
<style lang="stylus">
  .middle-modificator
    position absolute
    left calc(50% - 71px)
  .items__select
    max-width 100%
    &--no-selected
      width 180px
      .q-field__marginal
        height auto!important
    .q-field__marginal
      height 48px
  .items__popup
    .select__filter
      position sticky
      top 0
      z-index 1
    .select__get-deleted
      position sticky
      bottom 0
      z-index 1
  .items__filter
    min-width 250px
    border 1px solid $grey-9
    border-radius 3px
  .cheap-modifier
    font-size .6rem
    font-weight bolder
    border-radius 3px
    background-color #90a4ae
    color white
    padding 0 2px
    width 45px
    position absolute
    top -10px
    right 0px
    &--item
      top 5px
  .deleted-action
    width 100%
    color #eee
    background-color #999
    font-size .7rem
    padding-top 0
    padding-bottom 0
</style>
