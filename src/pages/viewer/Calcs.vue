<template>
  <q-page>
    <q-resize-observer @resize="onResizePage" />
    <entities-toolbar
      :item="selectedItem" :actions="actions"
    >
      <div style="max-width: 50%" :class="{'middle-modificator': !active}" slot="selects">
        <q-select
          ref="itemSelect"
          class="items__select"
          :class="{'items__select--no-selected': !active}"
          :value="active"
          :options="filteredItems"
          filled
          :loading="isItemsInitStart && !isItemsInit"
          :label="active ? 'Calcs' : 'SELECT CALC'"
          dark hide-bottom-space dense color="white"
          :disable="!isNeedSelect || (typeof isNeedSelect === 'string' && isNeedSelect.indexOf('calcs') > -1)"
          :hide-dropdown-icon="!isNeedSelect || (typeof isNeedSelect === 'string' && isNeedSelect.indexOf('calcs') > -1)"
          popup-content-class="items__popup"
          :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + (needShowGetDeletedAction && tokenType === 1 ? 77 : 48) + (filteredItems.length ? 0 : 4)}px`}"
          @filter="(filter, update) => filterItems('calcs', filter, update)"
        >
          <div slot="before-options" class="bg-dark q-pa-xs select__filter">
            <q-input v-model="filter" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" @input="filter => $refs.itemSelect.filter(filter)" autofocus>
              <q-icon slot="prepend" name="mdi-magnify" color="white" />
            </q-input>
          </div>
          <div slot="after-options" class="select__get-deleted" v-if="needShowGetDeletedAction && tokenType === 1">
            <q-btn icon="mdi-download" class="deleted-action" @click.prevent.stop="getDeletedHandler">see deleted</q-btn>
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
                <q-item-label v-if="selectedItem.deleted" class="q-pa-none text-right"><small class="cheap-modifier">DELETED</small></q-item-label>
                <q-item-label class="q-pa-none q-mt-none text-right"><small>#{{selectedItem.id}}</small></q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              @click="active = scope.opt.id"
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
      v-if="isInit && active"
      :item="selectedItem"
      :limit="limit"
      originPattern="gw/calcs/:id"
      :isEnabled="true"
      :config="config.logs"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', maxWidth: widgetStyle.top ? '66%' : ''}"
      @view-log-message="viewWidgetsLogHandler"
      @action-select="data => widgetsViewedLog = data.content"
    />
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Calcs not found'}}</div>
      <q-btn v-if="!isLoading && needShowGetDeletedAction && tokenType === 1" class="q-mt-sm" @click="getDeletedHandler" icon="mdi-download" label="see deleted"/>
    </div>
    <widgets
      ref="logsView"
      :active="activeWidgetWindow === 'logsView'"
      v-model="isWidgetsLogsActive"
      :siblingHeight="siblingHeight.logs"
      :config="logsWidgetsViewConfig"
      :actions="widgetsHandleActions"
      :controls="widgetWindowControls"
      @minimize="data => widgetsMinimizeHandler('logs', data)"
      @active="activateWidgetWindow('logsView')"
      @close="closeLogsWidgetsHandler"
      @next="nextWidgetLog"
      @prev="prevWidgetLog"
    />
  </q-page>
</template>

<script>
import logs from '../../components/logs/Index.vue'
import MainWidgetsMixin from '../../components/widgets/MainWidgetsMixin'
import LogsWidgetsMixin from '../../components/widgets/LogsWidgetsMixin'
import Widgets from '../../components/widgets/Widgets'
import { mapState, mapActions } from 'vuex'
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
  mixins: [init, MainWidgetsMixin, LogsWidgetsMixin],
  data () {
    return {
      filter: '',
      active: null,
      isInit: false,
      isItemsInit: false,
      isItemsInitStart: false,
      needShowGetDeletedAction: true
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        return state[this.config.logs.vuexModuleName] ? !state[this.config.logs.vuexModuleName].messages.length : false
      },
      tokenType (state) { return state.tokenInfo && state.tokenInfo.access ? state.tokenInfo.access.type : -1 },
      itemsCollection (state) {
        return state.calcs || {}
      },
      tasksByCalc (state) {
        return Object.values(state.tasks || {})
      }
    }),
    items () {
      return Object.values(this.itemsCollection)
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
          label: 'Intervals',
          icon: 'mdi-set-center',
          handler: () => this.moveToIntervals(null, this.active),
          condition: !!this.tasksByCalc.length
        },
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
    ...mapActions(['getDeleted']),
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true
      }).onOk(() => { this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`) })
        .onCancel(() => {})
    },
    async getDeletedHandler () {
      await this.getDeleted('calcs')
      this.needShowGetDeletedAction = false
      this.$refs.itemSelect.reset()
    },
    clearActive () {
      this.active = null
    },
    init () {
      const entity = 'calcs',
        activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined),
        idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      this.isInit = true
      if (idFromRoute && this.itemsCollection[idFromRoute]) {
        this.active = idFromRoute
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        this.active = activeFromLocaleStorage
      } else {
        this.active = null
      }
      this.$emit('inited')
    },
    moveToIntervals (deviceId, calcId) {
      this.$nextTick(() => { this.$router.push(`/device/${deviceId}/calc/${calcId}/intervals?noselect=calcs`).catch(err => err) })
    },
    clearWidgetsState () {
      this.isWidgetsLogsActive = false
      this.widgetsMinimizedOptions = {}
      this.activeWidgetWindow = undefined
      this.widgetsViewedLog = null
    },
    onResizePage (size) {
      this.$refs.logsView.resize(size)
    }
  },
  watch: {
    $route (route) {
      if (route.params && route.params.id) {
        const id = Number(route.params.id)
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
      const currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'calcs' }, value: currentItem.id })
        this.$router.push(`/calcs/${val}`).catch(err => err)
      } else {
        this.$router.push('/calcs').catch(err => err)
      }
    }
  },
  components: { logs, EntitiesToolbar, Widgets }
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
