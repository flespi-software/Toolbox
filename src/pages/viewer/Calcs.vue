<template>
  <q-page>
    <q-toolbar color="dark" class="justify-between">
      <div style="max-width: 50%" :class="{'middle-modificator': !active}" v-if="items.length">
        <q-item class="no-padding" :style="{cursor: isNeedSelect ? '' : 'default!important'}" >
          <q-item-main>
            <q-item-tile label class="ellipsis overflow-hidden" :style="{maxWidth: '140px'}">{{active ? selectedItem.name || '&lt;noname&gt;' : 'SELECT CALC'}}</q-item-tile>
          </q-item-main>
          <q-item-side class="text-right">
            <q-item-tile style="display: inline-block" stamp color="white" class="text-center" v-if="active"><div v-if="selectedItem.deleted" class="cheap-modifier"><small>DELETED</small></div>#{{selectedItem.id.toString()}}</q-item-tile>
            <q-item-tile v-if="isNeedSelect" style="display: inline-block" stamp color="white" size="2rem" icon="mdi-menu-down" />
          </q-item-side>
          <q-popover fit ref="popoverActive" v-if="isNeedSelect" :anchor="active ? undefined : 'bottom middle'" :self="active ? undefined : 'top middle'">
            <q-input v-model="filter" color="dark" clearable placeholder="Filter" hide-underline class="q-ma-xs q-pa-xs items__filter"/>
            <q-list link separator class="scroll">
              <VirtualList
                v-if="filteredItems.length"
                :size="40"
                :remain="filteredItems.length > 6 ? 6 : filteredItems.length"
              >
                <q-item
                  v-for="(item, index) in filteredItems"
                  :key="index"
                  @click.native="active = item.id, $refs.popoverActive.hide(), $emit('view-data-hide')"
                  class="cursor-pointer"
                  :class="{'text-grey-8': item.deleted}"
                  highlight
                >
                  <q-item-main>
                    <q-item-tile label class="ellipsis overflow-hidden">{{item.name || '&lt;noname&gt;'}}</q-item-tile>
                  </q-item-main>
                  <q-item-side class="text-center">
                    <q-item-tile v-if="item.deleted" class="cheap-modifier"><small>DELETED</small></q-item-tile>
                    <q-item-tile><small>#{{item.id.toString()}}</small></q-item-tile>
                  </q-item-side>
                </q-item>
              </VirtualList>
              <div v-else class="text-center q-ma-md">
                No Calcs
              </div>
            </q-list>
            <q-btn icon="mdi-download" class="deleted-action" @click="getDeletedHandler" v-if="needShowGetDeletedAction && tokenType === 1">see deleted</q-btn>
          </q-popover>
        </q-item>
      </div>
      <q-btn v-if="active && !selectedItem.deleted" flat dense class="on-right pull-right text-center round-borders q-px-xs q-py-none" color="white" @click="modeModel = !modeModel" style="min-width: 70px; max-width: 70px;">
        <q-icon size="1.5rem" color="white" :name="modeModel ? 'playlist_play' : 'history'"/>
        <div style="font-size: .7rem;">{{modeModel ? 'Real-time' : 'History'}}</div>
        <div class="bg-red text-white q-pa-xs round-borders cursor-pointer absolute-top-right" v-if="newMessagesCount" style="font-size: .6rem;">{{newMessagesCount}}</div>
        <q-tooltip>Mode (Real-time/History)</q-tooltip>
      </q-btn>
      <div v-if="active" class="flex" style="width: 46px;">
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="Clear all panes" class="on-left cursor-pointer pull-right text-center q-py-none" v-if="modeModel && !isEmptyMessages" @click="clearHandler" flat dense style="width: 60px">
            <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
            <div style="font-size: .7rem;">Clear</div>
          </q-btn>
        </transition>
      </div>
    </q-toolbar>
    <logs
      ref="logs"
      v-if="isInit && active"
      :mode="mode"
      :item="selectedItem"
      :limit="limit"
      originPattern="gw/calcs/:id"
      :isEnabled="true"
      :config="config.logs"
      :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
      @view-log-message="viewLogMessagesHandler"
    />
    <div v-if="!items.length" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Calcs not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import { mapState, mapActions } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'
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
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      itemsCollection (state) {
        return state.items
      },
      items (state) {
        return Object.values(state.items)
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
      await this.getDeleted('calcs')
      this.needShowGetDeletedAction = false
    },
    clearActive () {
      this.active = null
    },
    deletedHandler () {
      this.mode = 0
    },
    init () {
      let entity = 'calcs',
        activeFromLocaleStorage = this.$q.localStorage.get.item(entity),
        idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      this.isInit = true
      if (idFromRoute && this.itemsCollection[idFromRoute]) {
        this.active = idFromRoute
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        this.active = activeFromLocaleStorage
      } else {
        this.active = null
      }
      // deleted item logic
      if (this.selectedItem && this.selectedItem.deleted) {
        this.deletedHandler()
      }
    }
  },
  watch: {
    $route (route) {
      if (route.params && route.params.id) {
        let id = Number(route.params.id)
        if (this.itemsCollection[id]) {
          this.active = id
        } else {
          this.active = null
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      let currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$q.localStorage.set('calcs', val)
        this.$router.push(`/calcs/${val}`)
      } else {
        this.$router.push('/calcs')
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      }
    }
  },
  components: { logs, VirtualList }
}
</script>
<style lang="stylus">
  @import '~variables'
  .middle-modificator
    position absolute
    left calc(50% - 71px)
  .items__filter {
    min-width: 250px;
    border: 1px solid $dark;
    border-radius: 3px;
  }
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
