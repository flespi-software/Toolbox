import { date } from 'quasar'
import get from 'lodash/get'
import JsonTree from '../JsonTree'
import ObjectView from '../ObjectView'
import MapFrame from '../MapFrame'
/*
<widgets
  ref="intervalsView"
  :active="activeWidgetWindow === 'intervalsView'"
  v-model="isWidgetsIntervalsActive"
  :config="intervalsWidgetsViewConfig"
  :actions="widgetsHandleActions"
  :controls="widgetWindowControls"
  :view-model="widgetsViewModel.intervals"
  @change-view-model="data => widgetsChangeViewModelHandler('intervals', data)"
  @active="activateWidgetWindow('intervalsView')"
  @close="closeIntervalsWidgetsHandler"
  @next="nextWidgetsInterval"
  @prev="prevWidgetsInterval"
/>
*/
export default {
  data () {
    return {
      isWidgetsIntervalsActive: false,
      widgetsViewedInterval: null
    }
  },
  computed: {
    fieldsIntervalsMetaData () {
      const cols = get(this.$refs, 'intervals.cols', undefined)
      const activeCols = get(this.$refs, 'intervals.$refs.scrollList.activeCols', [])
      let result = {}
      if (cols) {
        result = activeCols.reduce((result, col) => {
          result[col.name] = cols.enum[col.name]
          return result
        }, {})
      }
      return result
    },
    intervalsWidgetsViewConfig () {
      const config = {}
      if (this.widgetsViewedInterval) {
        const content = this.widgetsViewedInterval.content
        const entity = this.widgetsViewedInterval.entity
        const needTrack = entity.counters && entity.counters.filter((counter) => {
          return counter.type === 'route' && content[counter.name]
        }).length
        if (needTrack) {
          config.track = {
            title: 'Track',
            wrapper: MapFrame
          }
        }
        const description = `${content.ident ? `<div style="font-size: 1.1rem">${content.ident}</div>` : ''}${content.timestamp ? `<div style="font-size: .8rem">${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}</div>` : ''}`
        config.message = {
          title: 'JSON',
          description,
          wrapper: JsonTree,
          data: content
        }
        config.object = {
          title: 'Fields',
          description,
          wrapper: ObjectView,
          data: content,
          meta: this.fieldsIntervalsMetaData,
          action: this.intervalsWidgetActionHandler
        }
      }
      return config
    }
  },
  methods: {
    setWidgetsIntervalView ({ content, entity }) {
      this.widgetsViewedInterval = { content: { ...content }, entity }
      const routesFields = entity.counters && entity.counters.filter((counter) => {
        return counter.type === 'route'
      })

      const routes = Object.keys(content).reduce((routes, fieldName) => {
        if (routesFields.filter(field => field.name === fieldName).length) {
          routes.push(content[fieldName])
        }
        return routes
      }, [])

      if (!this.isWidgetsIntervalsActive) {
        if (this.beforeEnableWidgetByPane) {
          this.beforeEnableWidgetByPane('intervals')
        }
        this.isWidgetsIntervalsActive = true
      }
      this.$nextTick(() => {
        const map = this.$refs.intervalsView.ref('track')
        if (!map) { return }
        map.clear().autobounds(true).addRoutes(routes).send()
      })
      this.activateWidgetWindow('intervalsView')
    },
    intervalWidgetsActions (type, data) {
      const isActive = this.isWidgetsMessageActive
      this.setWidgetsIntervalView(data)
      const view = this.$refs.intervalsView
      switch (type) {
        case 'track': {
          view.setTab(type)
          break
        }
        case 'show': {
          view.setTab('message')
          break
        }
        case 'object': {
          if (!isActive) {
            view.setTab('object')
          }
          break
        }
        case 'select': {
          break
        }
      }
    },
    closeIntervalsWidgetsHandler () {
      if (this.$refs.intervals) {
        this.$refs.intervals.unselect()
      }
    },
    nextWidgetsInterval () {
      this.$refs.intervals.nextSelect()
    },
    prevWidgetsInterval () {
      this.$refs.intervals.prevSelect()
    },
    intervalsWidgetActionHandler ({ type, data }) {
      const list = get(this.$refs.intervals.$refs, 'scrollList', undefined)
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
