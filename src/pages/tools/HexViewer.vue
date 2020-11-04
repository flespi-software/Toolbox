<template>
  <q-page>
    <entities-toolbar :item="selectedItem">
      <div class="flex" :class="{'middle-modificator': !active}" slot="selects">
        <div style="display: inline-flex;">
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
            :virtual-scroll-sticky-size-end="0"
            popup-content-class="items__popup"
            :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + 48}px`}"
            @filter="filterItems"
          >
            <div slot="before-options" class="bg-dark q-pa-xs select__filter">
              <q-input v-model="filter" @input="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" autofocus>
                <q-icon slot="prepend" name="mdi-magnify" color="white" />
              </q-input>
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
                  <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope" v-if="filteredItems.length">
              <q-item
                v-bind="scope.itemProps"
                @click="active = scope.opt.id"
                v-on="scope.itemEvents"
                class="q-pa-xs"
                clickable
              >
                <q-item-section>
                  <q-item-label header class="ellipsis overflow-hidden q-pa-xs">{{scope.opt.name || '&lt;noname&gt;'}}</q-item-label>
                  <q-item-label class="q-pa-none q-mt-none" caption style="line-height: 0.75rem!important; margin-top: 1px;"><small>{{scope.opt.uri || '&lt;no uri&gt;'}}</small></q-item-label>
                </q-item-section>
                <q-item-section side>
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
    <hex-viewer v-if="active" :active="active" :isVisibleToolbar="isVisibleToolbar" :config="config" class="flex"/>
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg" style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Proxy channels not found'}}</div>
  </q-page>
</template>

<script>
import HexViewer from '../../components/hexViewer/Index'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import { mapState } from 'vuex'
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
      isInit: false,
      isItemsInit: false,
      filter: ''
    }
  },
  computed: {
    ...mapState({
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      PROXY_PROTOCOL_ID (state) {
        const protocols = state.channelsProtocols || {}
        return Object.keys(protocols).reduce((proxyId, protocolId) => {
          if (protocols[protocolId].name === 'proxy') {
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
    }
  },
  methods: {
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
      const currentItem = this.items.filter(item => item.id === val)[0] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'tools/hex' }, value: currentItem.id })
        this.$router.push(`/tools/hex/${val}`).catch(err => err)
      } else {
        this.$router.push('/tools/hex').catch(err => err)
      }
    }
  },
  components: { HexViewer, EntitiesToolbar }
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
</style>
