<template>
  <q-page>
    <entities-toolbar :item="selectedItem">
      <div class="flex" :class="{'middle-modificator': !active}" slot="selects">
        <div style="display: inline-flex;max-width: calc(100% - 80px);">
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
            :hide-dropdown-icon="!isNeedSelect"
            :virtual-scroll-item-size="48"
            :virtual-scroll-slice-size="6"
            :virtual-scroll-sticky-size-start="48"
            :virtual-scroll-sticky-size-end="needShowGetDeletedAction && tokenType === 1 ? 29 : 0"
            popup-content-class="items__popup"
            :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + (needShowGetDeletedAction && tokenType === 1 ? 77 : 48)}px`}"
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
                v-if="selectedItem"
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
                  <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.uri || '&lt;no uri&gt;'}}</small></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item" :class="{'cheap-modifier--mobile': $q.platform.is.mobile}">DELETED</small></q-item-label>
                  <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="View channels" class="on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white" style="width: 60px;" v-if="active" @click="viewLogsHandler" flat dense>
            <q-icon size="1.5rem" color="white" name="merge_type"/>
            <div style="font-size: .7rem; line-height: .7rem;">Channels</div>
          </q-btn>
        </transition>
      </div>
    </entities-toolbar>
    <div style="display: flex;" v-if="active">
      <messages
        v-show="$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"
        ref="messages"
        :activeId="active"
        :limit="0"
        :config="config.messages"
        :connection="activeConnection"
        :type="activeConnection ? 'messages' : 'connections'"
        :view="typeOfHexView"
        :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', width: $q.platform.is.desktop ? '25%' : '100%', minWidth: '180px'}"
        @view-data="(content) => { selectedMessages = content }"
        @change:connection="content => { activeConnection = content }"
        @close="() => { activeConnection = null, selectedMessages = '' }"
        @connection:preview="connection => connectionPreview = connection"
        @connection:preview-hide="connection => connectionPreview = null"
      />
      <div v-show="$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)" :style="{width: $q.platform.is.desktop ? '75%' : '100%'}">
        <q-toolbar class="bg-grey-9" v-if="activeConnection">
          <q-icon size="1.5rem" class="cursor-pointer" name="mdi-close" v-if="$q.platform.is.mobile" @click.native="() => { selectedMessages = '' }"/>
          <q-toolbar-title>
            <div class="text-white">{{activeConnection.peer}}</div>
            <div class="text-white" style="font-size: .7rem;">{{activeConnection.ident}}</div>
          </q-toolbar-title>
          <q-btn color="white" flat dense :icon="typeOfHexView === 'hex' ? 'mdi-matrix' : 'mdi-format-text'" @click="typeOfHexView = typeOfHexView === 'hex' ? 'text' : 'hex'">
            <q-tooltip>Change view mode (hex/text)</q-tooltip>
          </q-btn>
        </q-toolbar>
        <hex-viewer
          v-if="activeConnection"
          :style="{height: `calc(100vh - ${isVisibleToolbar ? activeConnection ? '150px' : '100px' : '100px'})`, position: 'relative', overflow: 'auto'}"
          :hex="hex"
          :view="typeOfHexView"
        />
        <div v-else-if="$q.platform.is.desktop && connectionPreview" class="q-pa-md" style="overflow: hidden; max-height: calc(100vh - 100px);">
          <q-timeline layout="loose" color="white" dark>
            <message-preview-item v-for="(message, index) in connectionPreview.messages.slice(0, 20)" :key="index" :message="message" :view="typeOfHexView"/>
          </q-timeline>
        </div>
        <div style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" v-else>
          <div>Select connection</div>
          <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
          <div>Find message</div>
          <q-icon name="mdi-arrow-down-bold-outline" size="3rem"/>
          <div>Analyze data</div>
        </div>
      </div>
    </div>
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg" style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Proxy channels not found'}}</div>
    <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="active && selectedItem && selectedItem.deleted">Nothing to show by channel &#171;{{selectedItem.name}}&#187; <div style="font-size: 0.9rem">or you haven`t access</div></div>
  </q-page>
</template>

<script>
import messages from '../../components/hexViewer/Messages'
import MessagePreviewItem from '../../components/hexViewer/MessagePreviewItem'
import HexViewer from '../../components/hexViewer/HexViewer'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import { mapState, mapActions } from 'vuex'
import init from '../../mixins/entitiesInit'
import get from 'lodash/get'

export default {
  name: 'PageHexViewer',
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [init],
  data () {
    return {
      active: null,
      activeConnection: null,
      isInit: false,
      isItemsInit: false,
      needShowGetDeletedAction: true,
      selectedMessages: '',
      typeOfHexView: 'hex',
      left: true,
      filter: '',
      connectionPreview: null
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        return this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length
      },
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      PROXY_PROTOCOL_ID (state) {
        const protocols = state.protocols || {}
        return Object.keys(protocols).reduce((proxyId, protocolId) => {
          if (protocols[protocolId] === 'proxy') {
            proxyId = parseInt(protocolId)
          }
          return proxyId
        }, 0)
      },
      items (state) { return Object.values(state.channels || {}).filter(item => this.PROXY_PROTOCOL_ID && item.protocol_id === this.PROXY_PROTOCOL_ID) }
    }),
    filteredItems () {
      const filter = this.filter.toLowerCase()
      const filteredItems = this.filter ? this.items.filter(item => {
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
        const lName = l.name.toLowerCase()
        const rName = r.name.toLowerCase()
        if (lName < rName) {
          return -1
        } else if (lName > rName) {
          return 1
        }
        return 1
      })
      return filteredItems
    },
    selectedItem () {
      return this.items.filter(item => item.id === this.active)[0] || null
    },
    hex () {
      if (this.selectedMessages && this.activeConnection) {
        return this.selectedMessages.reduce((hex, message) => {
          hex += message['proxy.payload.hex'] || ''
          return hex
        }, '')
      }
      return false
    }
  },
  methods: {
    ...mapActions(['getDeleted']),
    filterItems (filter, update) {
      if (this.isItemsInit) {
        update()
        return
      }
      const entity = 'channels'
      this.itemsLoad(entity, update, this.active, () => { this.isItemsInit = true })
    },
    unselect () {
      this.$refs.messages.unselect()
    },
    async getDeletedHandler () {
      await this.getDeleted('channels')
      this.needShowGetDeletedAction = false
      this.$refs.itemSelect.reset()
    },
    viewLogsHandler () {
      this.$router.push(`/channels/${this.active}`).catch(err => err)
    },
    init () {
      const entity = 'tools/hex'
      const activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined)
      this.isInit = true
      if (this.$route.params && this.$route.params.id) {
        if (this.items.filter(item => item.id === Number(this.$route.params.id)).length) {
          this.active = Number(this.$route.params.id)
        } else {
          this.active = null
        }
      } else if (activeFromLocaleStorage && this.items.filter(item => item.id === activeFromLocaleStorage).length) {
        this.active = activeFromLocaleStorage
      }
      this.$emit('inited')
    }
  },
  watch: {
    $route (route) {
      if (route.params && route.params.id) {
        if (this.items.filter(item => item.id === Number(route.params.id)).length) {
          this.active = Number(route.params.id)
        } else if (this.isInit) {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      this.activeConnection = null
      this.selectedMessages = ''
      const currentItem = this.items.filter(item => item.id === val)[0] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'tools/hex' }, value: currentItem.id })
        this.$router.push(`/tools/hex/${val}`).catch(err => err)
      } else {
        this.$router.push('/tools/hex').catch(err => err)
      }
    }
  },
  components: { messages, HexViewer, EntitiesToolbar, MessagePreviewItem }
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
    &--mobile
      right 7px
  .deleted-action
    width 100%
    color #eee
    background-color #999
    font-size .7rem
    padding-top 0
    padding-bottom 0
</style>
