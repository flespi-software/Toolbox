import { date } from 'quasar'
import get from 'lodash/get'
import JsonTree from '../JsonTree.vue'
import ObjectView from '../ObjectView'
/*
<widgets
  ref="logsView"
  :active="activeWidgetWindow === 'logsView'"
  v-model="isWidgetsLogsActive"
  :config="logsWidgetsViewConfig"
  :actions="widgetsHandleActions"
  :controls="widgetWindowControls"
  :view-model="widgetsViewModel.logs"
  @change-view-model="data => widgetsChangeViewModelHandler('logs', data)"
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
    fieldsLogsMetaData () {
      const schema = get(this.$refs, 'logs.cols', undefined)
      let result = {}
      if (schema) {
        const cols = Object.values(schema.enum)
        const activeCols = get(this.$refs, 'logs.$refs.scrollList.activeCols', []).reduce((res, col) => {
          res[col.name] = { ...col, display: true }
          return res
        }, {})
        if (cols) {
          result = cols.reduce((result, col) => {
            result[col.name] = { ...col, display: !!activeCols[col.name] }
            return result
          }, {})
          result = { ...activeCols, ...result }
        }
      }
      return result
    },
    logsWidgetsViewConfig () {
      const log = this.widgetsViewedLog
      let config = {}
      if (log) {
        config = {
          'log object': {
            title: 'log object',
            description: log['x-flespi-description'],
            wrapper: JsonTree,
            data: log
          },
          object: {
            title: 'Fields',
            description: log['x-flespi-description'],
            wrapper: ObjectView,
            meta: this.fieldsLogsMetaData,
            action: this.logsWidgetActionHandler,
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
      if (this.beforeEnableWidgetByPane) {
        this.beforeEnableWidgetByPane('logs')
      }
      this.isWidgetsLogsActive = true
      this.activateWidgetWindow('logsView')
    },
    closeLogsWidgetsHandler () {
      if (this.$refs.logs) {
        this.$refs.logs.unselect()
      }
    },
    nextWidgetLog () {
      this.$refs.logs.nextSelect()
    },
    prevWidgetLog () {
      this.$refs.logs.prevSelect()
    },
    logsWidgetActionHandler ({ type, data }) {
      const list = get(this.$refs.logs.$refs, 'scrollList', undefined)
      if (!list) { return }
      switch (type) {
        case 'col-add': {
          list.addCustomColumnHandler(data)
          break
        }
        case 'col-remove': {
          list.removeCustomColumnHandler(data)
          break
        }
      }
    }
  }
}
