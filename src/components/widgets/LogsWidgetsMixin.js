import { date } from 'quasar'
import JsonTree from '../JsonTree.vue'
/*
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
*/
export default {
  data () {
    return {
      isWidgetsLogsActive: false,
      widgetsViewedLog: null
    }
  },
  computed: {
    logsWidgetsViewConfig () {
      const log = this.widgetsViewedLog
      let config = {}
      if (log) {
        config = {
          'log object': {
            title: 'log object',
            description: log._description,
            wrapper: JsonTree,
            data: log
          }
        }
        if (log.item_data) {
          config.item_data = {
            title: 'item data',
            wrapper: JsonTree,
            data: log.item_data
          }
        }
        if (log.http_data) {
          config.http_data = {
            title: 'http data',
            wrapper: JsonTree,
            data: log.http_data
          }
        }
        if (log.properties) {
          config.properties = {
            title: 'properties',
            wrapper: JsonTree,
            data: log.properties
          }
        }
        if (log.pending) {
          config.pending = {
            title: 'pending',
            wrapper: JsonTree,
            data: log.pending
          }
        }
        if (log.current) {
          config.current = {
            title: `${log.name} [${date.formatDate(log.timestamp * 1000, 'HH:mm:ss')}]`,
            wrapper: JsonTree,
            data: log.current
          }
        }
      }
      return config
    }
  },
  methods: {
    viewWidgetsLogHandler (content) {
      this.widgetsViewedLog = content
      this.isWidgetsLogsActive = true
      this.activateWidgetWindow('logsView')
      if (!this.widgetStyle.top) {
        this.$nextTick(() => this.$refs.logsView.minimize('top'))
      }
    },
    closeLogsWidgetsHandler () {
      this.$refs.logs.unselect()
    },
    nextWidgetLog () {
      this.$refs.logs.nextSelect()
    },
    prevWidgetLog () {
      this.$refs.logs.prevSelect()
    }
  }
}
