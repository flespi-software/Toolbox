import { date } from 'quasar'
import JsonTree from '../JsonTree'
import ObjectView from '../ObjectView'
import MapFrame from '../MapFrame'
/*
<widgets
  ref="intervalsView"
  :active="activeWidgetWindow === 'intervalsView'"
  v-model="isWidgetsIntervalsActive"
  :siblingHeight="siblingHeight.intervals"
  :config="intervalsWidgetsViewConfig"
  :actions="widgetsHandleActions"
  :controls="widgetWindowControls"
  @minimize="data => widgetsMinimizeHandler('intervals', data)"
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
        config.message = {
          title: 'JSON',
          description: `${content.ident ? `[${content.ident}]` : ''}${content.timestamp ? ` (${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')})` : ''}`,
          wrapper: JsonTree,
          data: content
        }
        config.object = {
          title: 'Fields',
          description: `${content.ident ? `[${content.ident}]` : ''}${content.timestamp ? ` (${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')})` : ''}`,
          wrapper: ObjectView,
          data: content
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
        this.isWidgetsIntervalsActive = true
        if (!this.widgetStyle.top) {
          this.$nextTick(() => this.$refs.intervalsView.minimize('top'))
        }
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
      this.$refs.intervals.unselect()
    },
    nextWidgetsInterval () {
      this.$refs.intervals.nextSelect()
    },
    prevWidgetsInterval () {
      this.$refs.intervals.prevSelect()
    }
  }
}
