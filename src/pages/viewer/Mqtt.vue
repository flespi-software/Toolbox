<template>
  <q-page>
    <entities-toolbar
      :item="selectedItem" :actions="actions">
      <div style="max-width: 50%" :class="{'middle-modificator': !active}" slot="selects">
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
              v-if="selectedItem"
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
                <q-item-label v-if="scope.opt.deleted" class="q-pa-xs text-right"><small class="cheap-modifier cheap-modifier--item" :class="{'cheap-modifier--mobile': $q.platform.is.mobile}">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right" :class="{'q-pr-xs': $q.platform.is.mobile}"><small>#{{scope.opt.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </entities-toolbar>
    <logs
      ref="logs"
      v-if="isInit && selectedItem"
      :item="selectedItem"
      :cid="selectedItem.id"
      :limit="limit"
      originPattern="mqtt/*"
      :isEnabled="true"
      :config="config.logs"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative'}"
      @view-log-message="viewLogMessagesHandler"
    />
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Subacounts not found'}}</div>
    </div>
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import { mapState } from 'vuex'
import init from '../../mixins/entitiesInit'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import get from 'lodash/get'

export default {
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
      isInit: false,
      isItemsInit: false,
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
        const defaultItem = this.myAccount
        const items = { [defaultItem.id]: defaultItem, ...state.subaccounts }
        return items
      }
    }),
    items () {
      return Object.values(this.itemsCollection || {})
    },
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
      const item = this.itemsCollection[this.active] || null
      return item
    },
    actions () {
      return [
        {
          label: 'Clear',
          icon: 'mdi-playlist-remove',
          handler: this.clearHandler,
          condition: !this.isEmptyMessages
        }
      ]
    }
  },
  methods: {
    filterItems (filter, update) {
      if (this.isItemsInit) {
        update()
        return
      }
      const entity = 'subaccounts'
      this.itemsLoad(entity, update, this.active, () => { this.isItemsInit = true })
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
    init () {
      const entity = 'mqtt',
        activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined),
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
      } else {
        this.active = this.myAccount.id
      }
      this.$emit('inited')
    }
  },
  watch: {
    $route (route) {
      if (route.params && route.params.id) {
        const id = Number(route.params.id)
        if (this.itemsCollection[id]) {
          this.active = id
        } else if (this.isInit) {
          this.active = this.myAccount.id
        }
      } else if (route.params && !route.params.id) {
        this.active = null
      }
    },
    active (val) {
      const currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'mqtt' }, value: currentItem.id })
        this.$router.push(`/mqtt/${val}`).catch(err => err)
      } else {
        this.$router.push('/mqtt').catch(err => err)
      }
    }
  },
  components: { logs, EntitiesToolbar }
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
    &--mobile
      right 7px
  .deleted-action
    width 100%
    color #999
    background-color #eee
    font-size .7rem
    padding-top 0
    padding-bottom 0
</style>
