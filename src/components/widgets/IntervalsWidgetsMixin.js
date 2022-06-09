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
      const schema = get(this.$refs, `${this.intervalsWidgetsRefName}.cols`, undefined)
      const cols = Object.values(schema.enum)
      const activeCols = get(this.$refs, `${this.intervalsWidgetsRefName}.$refs.scrollList.activeCols`, []).reduce((res, col) => {
        res[col.name] = { ...col, display: true }
        return res
      }, {})
      let result = {}
      if (cols) {
        result = cols.reduce((result, col) => {
          result[col.name] = { ...col, display: !!activeCols[col.name] }
          return result
        }, {})
        result = { ...activeCols, ...result }
      }
      return result
    },
    mapExtendConfig () {
      let config = {}
      const selectors = get(this.widgetsViewedInterval, 'entity.selectors', undefined)
      if (selectors) {
        config = selectors.reduce((result, selectorInstanse, selectorIndex) => {
          if (selectorInstanse.type !== 'geofence') { return result }
          selectorInstanse.geofences.forEach((geofence, gIndex) => {
            const name = `${geofence.name||'NoName'}-${selectorIndex}-${gIndex}`
            if (geofence.type === 'circle') {
              if (!result.circles) { result.circles = {} }
              result.circles[name] = { center: geofence.center, radius: geofence.radius * 1000 }
            } else if (geofence.type === 'corridor') {
              if (!result.corridors) { result.corridors = {} }
              result.corridors[name] = { path: geofence.path, width: geofence.width * 1000 }
            } else if (geofence.type === 'polygon') {
              if (!result.polygons) { result.polygons = {} }
              result.polygons[name] = { path: geofence.path }
            }
          })
          return result
        }, {})
      }
      return config
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
    },
    intervalsWidgetsRefName () {
      return get(this.widgetsViewedInterval, 'refName')
    }
  },
  methods: {
    setWidgetsIntervalView ({ content, entity, refName }) {
      this.widgetsViewedInterval = { content: { ...content }, entity, refName }
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
        map.clear()
        if (this.mapExtendConfig) {
          map.addConfig(this.mapExtendConfig)
        }
        map.autobounds(true).addRoutes(routes).send()
      })
      this.activateWidgetWindow('intervalsView')
    },
    intervalWidgetsActions (type, data) {
      if (Array.isArray(data.content) && data.content.length !== 1) {
        this.isWidgetsIntervalsActive = false
        return false
      }

      data.content = data.content[0]
      const isActive = this.isWidgetsIntervalsActive
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
      if (this.$refs[this.intervalsWidgetsRefName]) {
        this.$refs[this.intervalsWidgetsRefName].unselect()
      }
    },
    nextWidgetsInterval () {
      this.$refs[this.intervalsWidgetsRefName].nextSelect()
    },
    prevWidgetsInterval () {
      this.$refs[this.intervalsWidgetsRefName].prevSelect()
    },
    intervalsWidgetActionHandler ({ type, data }) {
      const list = get(this.$refs[this.intervalsWidgetsRefName].$refs, 'scrollList', undefined)
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
  },
  created () {
    this.$watch('mapExtendConfig', (config) => {
      const map = this.$refs.intervalsView.ref('track')
      if (map) {
        map.clear(['polygons', 'circles', 'corridors'])
        map.addConfig(config)
        map.send()
      }
    })
    this.$watch('widgetsViewedInterval.refName', (ref, old) => {
      if (ref !== old && old) {
        this.$refs[old].unselect()
        if (ref.indexOf('related') === 0) {
          this.viewedInterval = null
        }
      }
    })
  }
}
