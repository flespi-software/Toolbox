import get from 'lodash/get'
/*
Example
<widgets
  ref="messageView"
  :active="activeWidgetWindow === 'messageView'"
  v-model="isMessageActive"
  :config="messageViewConfig"
  :actions="widgetsHandleActions"
  :controls="widgetWindowControls"
  @minimize="data => widgetsMinimizeHandler('message', data)"
  @active="activateWidgetWindow('messageView')"
  @close="closeMessageWidgetsHandler"
  @next="nextMessage"
  @prev="prevMessage"
/>
*/
export default {
  data () {
    return {
      widgetsHandleActions: [
        {
          name: 'prev',
          label: 'Previous message',
          icon: 'mdi-arrow-left-thick'
        },
        {
          name: 'next',
          label: 'Next message',
          icon: 'mdi-arrow-right-thick'
        }
      ],
      activeWidgetWindow: undefined
    }
  },
  computed: {
    widgetStyle () {
      const style = {}
      const confs = this.widgetsViewModel
      for (const name in confs) {
        const config = confs[name] || {}
        if (config.to) {
          style[config.to] = name
        }
      }
      return style
    },
    widgetWindowControls () {
      return {
        minimizeRight: !this.widgetStyle.right,
        minimizeLeft: !this.widgetStyle.left
      }
    },
    widgetsViewModel () {
      return get(this.settings.viewSettings, `${this.entityName}.widgetView`, {})
    }
  },
  methods: {
    widgetsChangeViewModelHandler (entity, view, model) {
      this.$emit('update:settings', { type: 'ENTITY_VIEW_SETTINGS_CHANGE', opt: { entity }, value: { widgetView: { ...this.widgetsViewModel, ...{ [view]: model } } } })
    },
    activateWidgetWindow (windowName) {
      this.activeWidgetWindow = windowName
    },
    ratioWidgetsModify (r) {
      const onlyLogs = r === 100
      const onlyMessages = r === 0
      if (onlyLogs) {
        this.isWidgetsMessageActive = false
        this.isWidgetsTrackActive = false
      } else if (onlyMessages) {
        this.isWidgetsLogsActive = false
      }
    }
  }
}
