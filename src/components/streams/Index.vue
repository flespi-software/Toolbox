<template>
  <div>
    <div v-if="!active" class="text-center" style="display: flex; justify-content: center; font-size: 1.5rem">
      <div class="text-grey-3" style="margin-top: 50px">
        <q-btn flat style="display: flex; flex-wrap: nowrap; margin-top: 20px" icon-right="mdi-menu-down" v-if="items.length">
          Select stream
          <q-popover fit ref="popoverNotActive">
            <q-list link separator class="scroll">
              <VirtualList
                :size="76"
                :remain="items.length > 6 ? 6 : items.length"
              >
                <q-item
                  v-if="items.length"
                  v-for="(item, index) in items"
                  :key="index"
                  @click.native="active = item.id, $refs.popoverNotActive.hide()"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: $q.platform.is.mobile ? '' : '140px'}">{{item.name || '&lt;noname&gt;'}}<q-tooltip v-if="$q.platform.is.desktop">{{item.name}}</q-tooltip></q-item-tile>
                    <q-item-tile v-if="item.configuration" sublabel><small>{{item.configuration.protocol || '&lt;no protocol&gt;'}}</small></q-item-tile>
                    <q-item-tile v-if="item.configuration" sublabel><small>{{item.configuration.uri || '&lt;no uri&gt;'}}</small></q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
            </q-list>
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">get deleted</q-btn>
          </q-popover>
        </q-btn>
        <div v-if="!items.length">{{isLoading ? 'Fetching data..' : 'Streams not found'}}</div>
      </div>
    </div>
    <template v-else>
      <q-toolbar slot="header" color="dark" class="justify-between">
        <q-item class="no-padding" style="max-width: 50%" :style="{cursor: isNeedSelect ? '' : 'default!important'}">
          <q-item-main>
            <q-tooltip v-if="selectedItem.configuration && selectedItem.configuration.protocol"><small>{{selectedItem.configuration.protocol}}</small></q-tooltip>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{selectedItem.name || '&lt;noname&gt;'}}</q-item-tile>
            <q-item-tile sublabel style="font-size: 0.8rem" v-if="selectedItem.configuration && selectedItem.configuration.uri">{{selectedItem.configuration.uri}}</q-item-tile>
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
                    <q-item-tile sublabel v-if="item.configuration && item.configuration.protocol"><small>{{item.configuration.protocol || '&lt;no protocol&gt;'}}</small></q-item-tile>
                    <q-item-tile sublabel v-if="item.configuration && item.configuration.uri"><small>{{item.configuration.uri || '&lt;no uri&gt;'}}</small></q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
            </q-list>
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">get deleted</q-btn>
          </q-popover>
        </q-item>
        <q-btn v-if="!selectedItem.deleted" flat class="on-left" color="white" @click="modeModel = !modeModel" :icon="modeModel ? 'playlist_play' : 'history'"  :rounded="$q.platform.is.mobile">
          <q-tooltip>Mode (Real-time/History)</q-tooltip>
          {{$q.platform.is.mobile ? '' : modeModel ? 'Real-time' : 'History'}}
          <q-chip small square pointing="left" color="red" v-if="newMessagesCount" class="cursor-pointer">{{newMessagesCount}}</q-chip>
        </q-btn>
        <div>
          <q-icon size="1.5rem" class="cursor-pointer pull-right" v-if="modeModel && !isEmptyMessages" color="white" name="mdi-playlist-remove" @click.native="clearHandler">
            <q-tooltip>Clear all panes</q-tooltip>
          </q-icon>
        </div>
      </q-toolbar>
      <logs
        ref="logs"
        :mode="mode"
        :item="selectedItem"
        :limit="limit"
        originPattern="gw/streams/:id"
        :isEnabled="true"
        :config="config.logs"
        :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
        @view-log-message="viewLogMessagesHandler"
      />
      <div class="text-center" style="font-size: 1.5rem; margin-top: 30px; color: white" v-if="selectedItem.deleted">Nothing to show by stream &#171;{{selectedItem.name}}&#187; <div style="font-size: 0.9rem">or you haven`t access</div></div>
    </template>
  </div>
</template>

<script>
import logs from '../logs/Index.vue'
import { mapState, mapActions } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'

export default {
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
      needShowGetDeletedAction: true
    }
  },
  computed: {
    ...mapState({
      newMessagesCount (state) {
        return state[this.config.logs.vuexModuleName] ? state[this.config.logs.vuexModuleName].newMessagesCount : 0
      },
      isEmptyMessages (state) {
        return state[this.config.logs.vuexModuleName] ? !state[this.config.logs.vuexModuleName].messages.length : false
      },
      tokenType (state) { return state.tokenInfo.access ? state.tokenInfo.access.type : -1 }
    }),
    items () {
      return this.$store.state.items
    },
    selectedItem () {
      return this.items.filter(item => item.id === this.active)[0] || {}
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
    viewDataHandler (content) {
      this.$emit('view-data', content)
    },
    viewLogMessagesHandler (content) {
      this.$emit('view-log-message', content)
    },
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true
      }).then(() => { this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`) })
        .catch(() => {})
    },
    async getDeletedHandler () {
      await this.getDeleted('streams')
      this.needShowGetDeletedAction = false
    }
  },
  created () {
    let activeFromLocaleStorage = this.$q.localStorage.get.item('streams')
    this.$store.dispatch('getItems', 'streams')
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
  destroyed () {
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
        this.$q.localStorage.set('streams', val)
        this.$router.push(`/streams/${val}`)
      } else {
        this.$router.push('/streams')
      }
      if (currentItem.deleted) {
        this.mode = 0
      }
    }
  },
  components: { logs, VirtualList }
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
