<template>
  <q-page>
     <q-toolbar class="justify-between bg-grey-9">
      <div style="max-width: 50%" :class="{'middle-modificator': !active}" v-if="items.length">
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          filled
          :hide-dropdown-icon="!isNeedSelect"
          :label="active ? 'Account' : 'SELECT ACCOUNT'"
          hide-bottom-space dense color="white" dark
          :disable="!isNeedSelect"
          :virtual-scroll-item-size="48"
          :virtual-scroll-slice-size="6"
          :virtual-scroll-sticky-start="48"
          popup-content-class="items__popup"
          :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + 48 + (filteredItems.length ? 0 : 33)}px`}"
          @filter="filterItems"
        >
          <div slot="before-options" class="q-pa-xs select__filter bg-dark">
            <q-input v-model="filter" outlined hide-bottom-space rounded dense dark color="white" placeholder="Filter" @input="filter => $refs.itemSelect.filter(filter)" autofocus>
              <q-icon slot="prepend" name="mdi-magnify" color="white" />
            </q-input>
          </div>
          <template v-slot:no-option>
            <div style="min-height: 77px;">
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
              </q-item-section>
              <q-item-section class="text-white" side>
                <q-item-label v-if="selectedItem.deleted" class="cheap-modifier q-pa-none"><small>DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
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
              </q-item-section>
              <q-item-section side>
                <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{scope.opt.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <q-btn v-if="active && !selectedItem.deleted" flat dense class="on-right pull-right text-center rounded-borders q-px-xs q-py-none" color="white" @click="modeModel = !modeModel" style="min-width: 73px; max-width: 73px;">
        <q-icon size="1.5rem" color="white" :name="modeModel ? 'playlist_play' : 'history'"/>
        <div style="font-size: .7rem; line-height: .7rem">{{modeModel ? 'Real-time' : 'History'}}</div>
        <q-tooltip>Mode (Real-time/History)</q-tooltip>
      </q-btn>
      <div v-if="active" class="flex" style="width: 46px;">
        <transition appear enter-active-class="animated bounceInDown" leave-active-class="animated bounceOutUp">
          <q-btn title="Clear all panes" class="on-left pull-right text-center q-py-none text-white" v-if="modeModel && !isEmptyMessages" @click="clearHandler" flat dense style="width: 60px">
            <q-icon size="1.5rem" color="white" name="mdi-playlist-remove"/>
            <div style="font-size: .7rem; line-height: .7rem">Clear</div>
          </q-btn>
        </transition>
      </div>
    </q-toolbar>
    <logs
      ref="logs"
      v-if="isInit && active"
      :mode="mode"
      :item="selectedItem"
      :cid="selectedItem.id"
      :limit="limit"
      originPattern="*"
      :isEnabled="true"
      :config="config.logs"
      :style="{minHeight: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
      @view-log-message="viewLogMessagesHandler"
    />
    <div v-if="!items.length" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Subacounts not found'}}</div>
    </div>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import { mapState } from 'vuex'
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
      mode: 1,
      active: null,
      isInit: false,
      filter: ''
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        return state[this.config.logs.vuexModuleName] ? !state[this.config.logs.vuexModuleName].messages.length : false
      },
      myAccount (state) {
        return {
          id: state.tokenInfo ? state.tokenInfo.cid : 0,
          name: '*Current*'
        }
      },
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      itemsCollection (state) {
        let defaultItem = this.myAccount
        let items = { [defaultItem.id]: defaultItem, ...state.items }
        return items
      }
    }),
    items () {
      return Object.values(this.itemsCollection)
    },
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
      let item = this.itemsCollection[this.active] || {}
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
    filterItems (filter, update) {
      update()
    },
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
      }).onOk(() => { this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`) })
        .onCancel(() => {})
    },
    clearActive () {
      this.active = null
    },
    deletedHandler () {
      this.mode = 0
    },
    init () {
      let entity = 'platform',
        activeFromLocaleStorage = this.$q.localStorage.getItem(entity),
        idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      this.isInit = true
      if (idFromRoute) {
        if (this.itemsCollection[idFromRoute]) {
          this.active = idFromRoute
        } else {
          this.active = this.myAccount.id
        }
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        this.active = activeFromLocaleStorage
      } else {
        this.active = this.myAccount.id
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
        this.$q.localStorage.set('platform', val)
        this.$router.push(`/platform/${val}`).catch(err => err)
      } else {
        this.$router.push('/platform').catch(err => err)
      }
      if (currentItem.deleted) {
        this.deletedHandler()
      }
    }
  },
  components: { logs }
}
</script>
<style lang="stylus">
  .middle-modificator
    position absolute
    left calc(50% - 123px)
    min-width 30%
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
    color #999
    background-color #eee
    font-size .7rem
    padding-top 0
    padding-bottom 0
</style>
