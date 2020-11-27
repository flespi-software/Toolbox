/*
Example
<widgets
  ref="messageView"
  :active="activeWidgetWindow === 'messageView'"
  v-model="isMessageActive"
  :siblingHeight="siblingHeight.message"
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
      activeWidgetWindow: undefined,
      widgetsMinimizedOptions: {}
    }
  },
  computed: {
    siblingHeight () {
      const siblingHeight = {}
      const confs = this.widgetsMinimizedOptions
      for (const name in confs) {
        const config = confs[name]
        siblingHeight[name] = null
        if (config && config.type === 'bottom') {
          siblingHeight[name] = this.size ? this.size[1] : 0
        } else if (config && config.type === 'top') {
          siblingHeight[name] = this.size ? this.size[0] : 100
        }
      }
      return siblingHeight
    },
    widgetStyle () {
      const style = {}
      const confs = this.widgetsMinimizedOptions
      for (const name in confs) {
        const config = confs[name] || {}
        if (config.type === 'bottom') {
          style.bottom = true
        } else if (config.type === 'top') {
          style.top = true
        }
      }
      return style
    },
    widgetWindowControls () {
      return {
        minimizeTop: !this.widgetStyle.top,
        minimizeBottom: !this.widgetStyle.bottom
      }
    }
  },
  methods: {
    widgetsMinimizeHandler (view, options) {
      this.$set(this.widgetsMinimizedOptions, view, options)
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
        this.widgetsMinimizedOptions.message = undefined
        this.widgetsMinimizedOptions.track = undefined
      } else if (onlyMessages) {
        this.isWidgetsLogsActive = false
        this.widgetsMinimizedOptions.logs = undefined
      }
    }
  }
}
