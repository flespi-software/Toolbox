<template>
  <q-page>
    <q-resize-observer @resize="onResizePage" />
    <entities-toolbar
      :item="selectedItem" :actions="actions">
      <template #selects><div></div></template>
    </entities-toolbar>
    <logs
      ref="logs"
      v-if="selectedItem"
      :item="selectedItem"
      :limit="limit"
      originPattern="ai/*"
      :entity-name="entityName"
      :isEnabled="true"
      :config="config.logs"
      :style="{height: `calc(100vh - ${isVisibleToolbar ? '100px' : '50px'})`, position: 'relative', ...panelsWidgetsStyle}"
      @view-log-message="viewWidgetsLogHandler"
      @action-select="data => widgetsViewedLog = data.content"
    />
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
import routerProcess from '../../mixins/routerProcess'
import { useMainStore } from 'src/stores/main'
import { useLogsStore } from 'src/qvirtualscroll/stores/logs'
import settingsStorage from 'src/infrastructure/settingsStorage'

export default {
  name: 'AiViewer',
  emits: ['inited', 'uninited', 'update:settings'],
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [MainWidgetsMixin, LogsWidgetsMixin, routerProcess],
  setup (props) {
    const mainStore = useMainStore()
    /* the list's own store — the registry hands back the very one the logs component uses */
    const logsStore = useLogsStore({
      name: props.config.logs.vuexModuleName,
      lsNamespace: 'flespi-toolbox-settings.cols',
      storage: settingsStorage,
      errorHandler: (err) => { mainStore.reqFailed(err) }
    })
    return { mainStore, logsStore }
  },
  data () {
    return {
      entityName: 'ai',
      active: null
    }
  },
  computed: {
    isEmptyMessages () {
      return !this.logsStore.messages.length
    },
    tokenInfo () { return this.mainStore.tokenInfo },
    selectedItem () {
      return this.tokenInfo ? { id: this.tokenInfo.cid, name: 'AI' } : null
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
  created () {
    this.$emit('inited')
  },
  components: { logs, EntitiesToolbar, Widgets }
}
</script>
