<template>
  <q-page>
    <q-resize-observer @resize="onResizePage" />
    <entities-toolbar
      :item="selectedItem" :actions="actions">
      <div slot="selects"></div>
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
import Widgets from '../../components/widgets/Widgets'
import { mapState } from 'vuex'
import EntitiesToolbar from '../../components/EntitiesToolbar'
import routerProcess from '../../mixins/routerProcess'

export default {
  props: [
    'limit',
    'isLoading',
    'isVisibleToolbar',
    'isNeedSelect',
    'config',
    'settings'
  ],
  mixins: [MainWidgetsMixin, LogsWidgetsMixin, routerProcess],
  data () {
    return {
      entityName: 'ai',
      active: null
    }
  },
  computed: {
    ...mapState({
      isEmptyMessages (state) {
        return state[this.config.logs.vuexModuleName] ? !state[this.config.logs.vuexModuleName].messages.length : false
      },
      tokenInfo (state) { return state.tokenInfo }
    }),
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
      const isLeftSide = this.widgetStyle.left && (this.isWidgetsMessageActive || this.isWidgetsLogsActive || this.isWidgetsTrackActive)
      const isRightSide = this.widgetStyle.right && (this.isWidgetsMessageActive || this.isWidgetsLogsActive || this.isWidgetsTrackActive)
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
        this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`)
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
