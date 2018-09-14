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
        <q-item class="no-padding" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
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
        <q-btn v-if="!selectedItem.deleted" flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'" :rounded="$q.platform.is.mobile">
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
          <q-chip small square color="red" v-if="newMessagesCount" class="cursor-pointer q-ml-sm">{{newMessagesCount}}</q-chip>
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
        </q-btn>
      </q-toolbar>
      <messages
        ref="messages"
        :mode="mode"
        :activeId="active"
        :isEnabled="true"
        :limit="limit"
        :config="config.messages"
        :style="{minHeight: `calc(50vh - ${isVisibleToolbar ? '50px' : '25px'})`, position: 'relative'}"
        @view-data="(content) => { selectedMessages = content }"
      />
      <div :style="{height: `calc(50vh - ${isVisibleToolbar ? '50px' : '25px'})`, position: 'relative', overflow: 'auto'}">
        <hex-viewer
          style="margin: 0 auto"
          :hex="hex"
        />
      </div>
      <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="selectedItem.deleted">Nothing to show by channel &#171;{{selectedItem.name}}&#187; <div style="font-size: 0.9rem">or you haven`t access</div></div>
    </template>
  </q-page>
</template>

<script>
import messages from '../../components/messages/channels/Index.vue'
import HexViewer from '../../components/HexViewer'
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
      isInit: false,
      needShowGetDeletedAction: true,
      selectedMessages: ''
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
        let protocols = state.protocols
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
      if (this.selectedMessages) {
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
    }
  },
  created () {
    let activeFromLocaleStorage = this.$q.localStorage.get.item('tools/hex')
    // if (!this.$store.state.hexViewer) {
    //   this.$store.registerModule('hexViewer', vuexModule)
    // }
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
  async destroyed () {
    await this.$store.dispatch('unsubscribeItems', 'channels')
    this.$store.commit('clearItems')
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
