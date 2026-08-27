<template>
  <q-page>
    <q-resize-observer @resize="onResizePage" />
    <entities-toolbar
      :item="selectedItem" :actions="actions"
    >
      <template #selects>
        <div style="max-width: 50%" :class="{'middle-modificator': !active}">
          <q-select
            ref="itemSelect"
            class="items__select inline-block"
            :class="{'items__select--no-selected': !active}"
            :model-value="active"
            :options="filteredItems"
            filled
            :loading="isItemsInitStart && !isItemsInit"
            :hide-dropdown-icon="!isNeedSelect"
            :label="active ? 'Account' : 'SELECT ACCOUNT'"
            hide-bottom-space dense color="white" dark
            :disable="!isNeedSelect"
            popup-content-class="items__popup"
            :popup-content-style="{height: `${((filteredItems.length > 6 ? 6 : filteredItems.length) * 48) + 48 + (filteredItems.length ? 0 : 33)}px`}"
            @filter="(filter, update) => filterItems('subaccounts', filter, update)"
          >
            <template #before-options>
              <div class="q-pa-xs select__filter bg-dark">
                <q-input v-model="filter" outlined hide-bottom-space rounded dense dark color="white" placeholder="Filter" @update:model-value="filter => $refs.itemSelect.filter(filter)" autofocus>
                  <template #prepend><q-icon  name="mdi-magnify" color="white" /></template>
                </q-input>
              </div>
            </template>
            <template v-slot:no-option>
              <div style="min-height: 77px;">
                <q-input v-model="filter" @update:model-value="filter => $refs.itemSelect.filter(filter)" outlined hide-bottom-space rounded dense color="white" dark placeholder="Filter" class="q-ma-xs" autofocus>
                  <template #prepend><q-icon  name="mdi-magnify" color="white" /></template>
                </q-input>
                <div class="text-center">No results</div>
              </div>
            </template>
            <template v-slot:selected-item="scope">
              <q-item
                v-if="selectedItem"
                v-bind="scope.itemProps"
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
                @click="updateActive(scope.opt.id)"
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
          <q-select
            v-if="active"
            style="min-width:180px;"
            label="Select type"
            class="inline-block vertical-top q-ml-sm ellipsis"
            dark
            v-model="itemtype"
            :options="itemtypes"
            emit-value map-options
            filled
            hide-bottom-space dense color="white"
          >
          </q-select>
        </div>
      </template>
    </entities-toolbar>
    <logs
      ref="logs"
      v-if="isInit && selectedItem"
      :item="selectedItem"
      :cid="selectedItem.id"
      :limit="limit"
      :itemtype="itemtype"
      originPattern="platform/customer/*"
      :entity-name="entityName"
      :isEnabled="true"
      :config="config.logs"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', ...panelsWidgetsStyle}"
      @view-log-message="viewWidgetsLogHandler"
      @action-select="data => widgetsViewedLog = data.content"
    />
    <div v-if="!items.length && isItemsInit" class="text-center text-grey-3 q-mt-lg">
      <div style="font-size: 2rem;">{{isLoading ? 'Fetching data..' : 'Subacounts not found'}}</div>
    </div>
    <widgets
      ref="logsView"
      :active="activeWidgetWindow === 'logsView'"
      v-model="isWidgetsLogsActive"
      :config="logsWidgetsViewConfig"
      :actions="widgetsHandleActions"
      :controls="widgetWindowControls"
      :view-model="widgetsViewModel.logs"
      @change-view-model="data => widgetsChangeViewModelHandler(entityName, 'logs', data)"
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
import Widgets from '../../components/widgets/Widgets.vue'
import EntitiesToolbar from '../../components/EntitiesToolbar.vue'
import init, { entitiesRouteGuards } from '../../mixins/entitiesInit'
import routerProcess from '../../mixins/routerProcess'
import { useMainStore } from 'src/stores/main'
import { useLogsStore } from 'src/qvirtualscroll/stores/logs'
import settingsStorage from 'src/infrastructure/settingsStorage'
import get from 'lodash/get'

export default {
  /* Vue Router 4 does not pick guards up from a mixin — see mixins/entitiesInit.js */
  ...entitiesRouteGuards,
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [init, MainWidgetsMixin, LogsWidgetsMixin, routerProcess],
  setup (props) {
    const mainStore = useMainStore()
    /* the list's own store — the registry hands back the very one the logs component uses */
    const logsStore = useLogsStore({
      name: props.config.logs.vuexModuleName,
      lsNamespace: 'flespi-toolbox-settings.cols',
      storage: settingsStorage,
      errorHandler: (err) => { mainStore.reqFailed(err) }
    })
    return { logsStore }
  },
  data () {
    return {
      entityName: 'platform',
      active: null,
      isInit: false,
      isItemsInit: false,
      isItemsInitStart: false,
      itemtype: 0,
      itemtypes: [
        { value: 0, label: 'REST API requests'},
        { value: 4, label: 'limits'},
        { value: 29, label: 'realms'},
        { value: 33, label: 'tokens'},
        { value: 37, label: 'grants'},
        { value: 38, label: 'identity-providers'},
        { value: 40, label: 'geofences'}
      ],
      filter: ''
    }
  },
  computed: {
    isEmptyMessages () {
      return !this.logsStore.messages.length
    },
    myAccount () {
      return {
        id: this.mainStore.tokenInfo ? this.mainStore.tokenInfo.cid : 0,
        name: '*Current*'
      }
    },
    tokenType () { return this.mainStore.tokenInfo && this.mainStore.tokenInfo.access ? this.mainStore.tokenInfo.access.type : -1 },
    itemsCollection () {
      const defaultItem = this.myAccount
      const items = { [defaultItem.id]: defaultItem, ...this.mainStore.subaccounts }
      return items
    },
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
    },
    panelsWidgetsStyle () {
      const style = {}
      const isLeftSide = this.widgetStyle.left && this.isWidgetsLogsActive
      const isRightSide = this.widgetStyle.right && this.isWidgetsLogsActive
      if (isLeftSide || isRightSide) {
        style.maxWidth = 'calc(100% - 400px)'
        if (isRightSide) { style.left = '400px' }
      }
      return style
    }
  },
  methods: {
    clearHandler () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Do you really want to clear all data from the panes?',
        ok: true,
        cancel: true,
        noRouteDismiss: true
      }).onOk(() => {
        this.logsStore.clearMessages()
        if (this.isWidgetsLogsActive) {
          this.isWidgetsLogsActive = false
          this.closeLogsWidgetsHandler()
        }
      })
        .onCancel(() => {})
    },
    clearActive () {
      this.updateActive(null)
    },
    updateActive (id) {
      this.updateRoute({name: this.entityName, params: { id }}, !this.active)
    },
    init () {
      const entity = 'platform',
        activeFromLocaleStorage = get(this.settings, `entities[${entity}]`, undefined),
        idFromRoute = this.$route.params && this.$route.params.id ? Number(this.$route.params.id) : null
      this.isInit = true
      let id = null
      if (idFromRoute && this.itemsCollection[idFromRoute]) {
        id = idFromRoute
      } else if (activeFromLocaleStorage && this.itemsCollection[activeFromLocaleStorage]) {
        id = activeFromLocaleStorage
      } else if (
        (idFromRoute && !this.itemsCollection[idFromRoute]) ||
        (activeFromLocaleStorage && !this.itemsCollection[activeFromLocaleStorage])
      ) {
        this.clearActive()
      }
      if (id) {
        this.active = id
        this.updateRoute({ name: this.entityName, params: { id } }, true)
      }
      this.$emit('inited')
    },
    clearWidgetsState () {
      this.isWidgetsLogsActive = false
      this.activeWidgetWindow = undefined
      this.widgetsViewedLog = null
    },
    onResizePage (size) {
      this.$refs.logsView.resize(size)
    },
    beforeEnableWidgetByPane (entity) {
      if (!this.widgetStyle.left && !this.isWidgetsLogsActive && !this.widgetsViewModel.logs) {
        this.$nextTick(() => this.widgetsChangeViewModelHandler(this.entityName, 'logs', { type: 'minimized', to: 'left' }))
      }
    }
  },
  watch: {
    $route (route) {
      if (route.params && route.params.id) {
        const id = Number(route.params.id)
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
      const currentItem = this.itemsCollection[val] || {}
      if (val) {
        this.$emit('update:settings', { type: 'ENTITY_CHANGE', opt: { entity: 'platform' }, value: currentItem.id })
      }
    }
  },
  components: { logs, EntitiesToolbar, Widgets }
}
</script>
<style lang="scss" scoped>
  .middle-modificator {
    position: absolute;
    left: calc(50% - 123px);
    min-width: 30%;
  }
  .items__select {
    max-width: 100%;
    &--no-selected {
      width: 180px;
      .q-field__marginal {
        height: auto!important;
      }
    }
    .q-field__marginal {
      height: 48px;
    }
  }
  .items__popup {
    .select__filter {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
  .cheap-modifier {
    font-size: .6rem;
    font-weight: bolder;
    border-radius: 3px;
    background-color: #90a4ae;
    color: white;
    padding: 0 2px;
    width: 45px;
    position: absolute;
    top: -10px;
    right: 0px;
    &--item {
      top: 5px;
    }
    &--mobile {
      right: 7px;
    }
  }
  .deleted-action {
    width: 100%;
    color: #999;
    background-color: #eee;
    font-size: .7rem;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
