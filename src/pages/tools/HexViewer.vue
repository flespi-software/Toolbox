<template>
  <q-page>
    <template  v-if="!active">
      <div class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
        <div class="text-grey-3" style="margin-top: 50px">
          <q-btn flat style="display: flex; flex-wrap: nowrap; margin-top: 20px" icon-right="mdi-menu-down" v-if="items.length">
            Select channel
            <q-popover fit ref="popoverNotActive">
              <q-list link separator class="scroll">
                <VirtualList
                  :size="76"
                  :remain="items.length > 6 ? 6 : items.length"
                >
                  <q-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click.native="active = item.id, $refs.popoverNotActive.hide()"
                    class="cursor-pointer"
                    :class="{'text-grey-8': item.deleted}"
                    highlight
                  >
                    <q-item-main>
                      <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || '&lt;noname&gt;'}}<q-tooltip v-if="$q.platform.is.desktop">{{item.name}}</q-tooltip></q-item-tile>
                      <q-item-tile sublabel><small>{{item.uri || '&lt;no uri&gt;'}}</small></q-item-tile>
                    </q-item-main>
                    <q-item-side class="text-center">
                      <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                      <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                    </q-item-side>
                  </q-item>
                </VirtualList>
              </q-list>
              <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">see deleted</q-btn>
            </q-popover>
          </q-btn>
          <div v-if="!items.length">{{isLoading ? 'Fetching data..' : 'Channels not found'}}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <q-toolbar color="dark" class="justify-between">
        <div>
          <q-item class="no-padding" style="display: inline-flex;" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
            <q-item-main>
              <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-tile>
              <q-item-tile sublabel style="font-size: 0.8rem">{{selectedItem.uri}}</q-item-tile>
            </q-item-main>
            <q-item-side class="text-right">
              <q-item-tile style="display: inline-block" stamp color="white" class="text-center"><div v-if="selectedItem.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedItem.id.toString()}}</q-item-tile>
              <q-item-tile v-if="isNeedSelect" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
            </q-item-side>
            <q-popover fit ref="popoverActive" v-if="isNeedSelect">
              <q-list link separator class="scroll">
                <VirtualList
                  :size="76"
                  :remain="items.length > 6 ? 6 : items.length"
                >
                  <q-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click.native="active = item.id, $refs.popoverActive.hide(), $emit('view-data-hide')"
                    class="cursor-pointer"
                    :class="{'text-grey-8': item.deleted}"
                    highlight
                  >
                    <q-item-main>
                      <q-item-tile label class="ellipsis overflow-hidden">{{item.name || '&lt;noname&gt;'}}</q-item-tile>
                      <q-item-tile sublabel><small>{{item.uri || '&lt;no uri&gt;'}}</small></q-item-tile>
                    </q-item-main>
                    <q-item-side class="text-center">
                      <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                      <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                    </q-item-side>
                  </q-item>
                </VirtualList>
              </q-list>
              <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">see deleted</q-btn>
            </q-popover>
          </q-item>
          <q-icon style="position: relative; top: 10px;" size="1.5rem" class="on-right cursor-pointer pull-right" vif="active" color="white" name="merge_type" @click.native="viewLogsHandler">
            <q-tooltip>View logs</q-tooltip>
          </q-icon>
        </div>
        <q-btn v-if="!selectedItem.deleted" flat :class="{'on-left': $q.platform.is.desktop}" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'" :rounded="$q.platform.is.mobile">
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
          <q-chip small square color="red" v-if="newMessagesCount && $q.platform.is.desktop" class="cursor-pointer q-ml-sm">{{newMessagesCount}}</q-chip>
          <span v-if="newMessagesCount && $q.platform.is.mobile" style="position: absolute; top: 2px; right: 2px; width: 7px; height: 7px; background-color: red; border-radius: 50%"></span>
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
        </q-btn>
        <div></div>
      </q-toolbar>
      <div style="display: flex;">
        <messages
          v-show="$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"
          ref="messages"
          :mode="mode"
          :activeId="active"
          :limit="limit"
          :config="config.messages"
          :connection="activeConnection"
          :type="activeConnection ? 'messages' : 'connections'"
          :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', width: $q.platform.is.desktop ? '25%' : '100%'}"
          @view-data="(content) => { selectedMessages = content }"
          @change:connection="content => { activeConnection = content }"
          @close="() => { activeConnection = null, selectedMessages = '' }"
        />
        <div v-show="$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)" :style="{width: $q.platform.is.desktop ? '75%' : '100%'}">
          <q-toolbar color="dark" v-if="activeConnection">
            <q-icon size="1.5rem" class="cursor-pointer" name="mdi-close" v-if="$q.platform.is.mobile" @click.native="() => { selectedMessages = '' }"/>
            <q-toolbar-title>
              {{activeConnection.peer}}
              <span slot="subtitle">
                {{activeConnection.ident}}
              </span>
            </q-toolbar-title>
            <q-checkbox dark color="white" style="margin-right: 10px" checked-icon="mdi-matrix" unchecked-icon="mdi-format-text" true-value="hex" false-value="text" v-model="typeOfHexView">
              <q-tooltip>Change view mode (hex/text)</q-tooltip>
            </q-checkbox>
          </q-toolbar>
          <hex-viewer
              v-if="activeConnection"
              :style="{height: `calc(100vh - ${isVisibleToolbar ? activeConnection ? '150px' : '100px' : '100px'})`, position: 'relative', overflow: 'auto'}"
              :hex="hex"
              :view="typeOfHexView"
            />
            <div style="text-align: center; color: #9e9e9e; font-size: 3rem; padding-top: 40px;" v-else>Select connection</div>
        </div>
      </div>
      <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="selectedItem.deleted">Nothing to show by channel &#171;{{selectedItem.name}}&#187; <div style="font-size: 0.9rem">or you haven`t access</div></div>
    </template>
  </q-page>
</template>

<script>
import messages from '../../components/hexViewer/Messages'
import HexViewer from '../../components/hexViewer/HexViewer'
import { mapState, mapActions } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  name: 'PageHexViewer',
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config'
  ],
  data () {
    return {
      mode: 1,
      active: null,
      activeConnection: null,
      isInit: false,
      needShowGetDeletedAction: true,
      selectedMessages: '',
      typeOfHexView: 'hex',
      left: true
    }
  },
  computed: {
    ...mapState({
      newMessagesCount (state) {
        return this.config.messages && state[this.config.messages.vuexModuleName] ? state[this.config.messages.vuexModuleName].newMessagesCount : 0
      },
      isEmptyMessages (state) {
        return this.config.messages && state[this.config.messages.vuexModuleName] && !state[this.config.messages.vuexModuleName].messages.length
      },
      tokenType (state) { return state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      PROXY_PROTOCOL_ID (state) {
        let protocols = state.protocols || {}
        return Object.keys(protocols).reduce((proxyId, protocolId) => {
          if (protocols[protocolId] === 'proxy') {
            proxyId = parseInt(protocolId)
          }
          return proxyId
        }, 0)
      },
      items (state) { return state.items.filter(item => this.PROXY_PROTOCOL_ID && item.protocol_id === this.PROXY_PROTOCOL_ID) }
    }),
    selectedItem () {
      return this.items.filter(item => item.id === this.active)[0] || {}
    },
    hex () {
      if (this.selectedMessages && this.activeConnection) {
        return this.selectedMessages.reduce((hex, message) => {
          hex += message['proxy.payload.hex'] || ''
          return hex
        }, '')
      }
      return false
    },
    modeModel: {
      get () {
        return !!this.mode
      },
      set (val) {
        let now = Date.now()
        this.date = val ? 0 : now - (now % 86400000)
        this.mode = Number(val)
        this.activeConnection = null
        this.selectedMessages = ''
        this.$emit('view-data-hide')
      }
    }
  },
  methods: {
    ...mapActions(['getDeleted']),
    unselect () {
      this.$refs.messages.unselect()
    },
    async getDeletedHandler () {
      await this.getDeleted('channels')
      this.needShowGetDeletedAction = false
    },
    viewLogsHandler () {
      this.$router.push(`/channels/${this.active}`)
    }
  },
  created () {
    let activeFromLocaleStorage = this.$q.localStorage.get.item('tools/hex')
    this.$store.dispatch('getItems', 'channels')
      .then(() => {
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
        // deleted item logic
        if (this.selectedItem.deleted) {
          this.mode = 0
        }
      })
  },
  beforeDestroy () {
    this.$store.dispatch('unsubscribeItems', 'channels')
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
      let currentItem = this.items.filter(item => item.id === val)[0] || {}
      if (val) {
        this.$q.localStorage.set('tools/hex', val)
        this.$router.push(`/tools/hex/${val}`)
      } else {
        this.$router.push('/tools/hex')
      }
      if (currentItem.deleted) {
        this.mode = 0
      }
    }
  },
  components: { messages, VirtualList, HexViewer }
}
</script>
<style>
  .no-top-bottom-margin {
    margin-bottom: 0;
    margin-top: 0;
  }
  .cheap-modifier {
    font-size: .7rem;
    font-weight: bolder;
    border-radius: 3px;
    background-color: #90a4ae;
    color: white;
    padding: 0 3px;
    margin-bottom: 3px;
  }
  .deleted-action {
    width: 100%;
    color: #999;
    background-color: #eee;
    font-size: .7rem;
    padding-top: 0;
    padding-bottom: 0
  }
</style>
