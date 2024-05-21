import { date } from 'quasar'
import get from 'lodash/get'
import JsonTree from '../JsonTree.vue'
import ObjectView from '../ObjectView'
import MessageView from '../MessageView'
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
            item: log,
            descriptionAction: log.traffic ? {
              handler: this.logsWidgetDescriptionActionHandler,
              type: 'to-error-traffic',
              title: 'View error traffic',
              icon: 'mdi-alert-outline',
              color: 'red'
            } : undefined
          },
          object: {
            title: 'Fields',
            description: log['x-flespi-description'],
            wrapper: ObjectView,
            meta: this.fieldsLogsMetaData,
            action: this.logsWidgetActionHandler,
            item: log
          }
        }
        if (log.message_timestamp && log.device_id) {
          config.message = {
            title: 'Message',
            // description: log['x-flespi-description'],
            wrapper: MessageView,
            meta: this.fieldsLogsMetaData,
            action: this.logsWidgetActionHandler,
            log: log
          }
        }
        if (log.item_data) {
          config.item_data = {
            title: 'item data',
            wrapper: JsonTree,
            item: log.item_data
          }
        }
        if (log.http_data) {
          config.http_data = {
            title: 'http data',
            wrapper: JsonTree,
            item: log.http_data
          }
        }
        if (log.properties) {
          config.properties = {
            title: 'properties',
            wrapper: JsonTree,
            item: log.properties
          }
        }
        if (log.pending) {
          config.pending = {
            title: 'pending',
            wrapper: JsonTree,
            item: log.pending
          }
        }
        if (log.current) {
          config.current = {
            title: `${log.name} [${date.formatDate(log.timestamp * 1000, 'HH:mm:ss')}]`,
            wrapper: JsonTree,
            item: log.current
          }
        }
      }
      return config
    }
  },
  methods: {
    viewWidgetsLogHandler (content) {
      if (Array.isArray(content) && content.length !== 1) {
        this.isWidgetsLogsActive = false
        return false
      }
      content = content[0]

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
    },
    logsWidgetDescriptionActionHandler ({ type, data }) {
      switch (type) {
        case 'to-error-traffic': {
          this.toErrorTrafficHandler({ content: data })
        }
      }
    }
  }
}
