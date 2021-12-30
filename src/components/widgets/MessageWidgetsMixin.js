import { date } from 'quasar'
import get from 'lodash/get'
import ImageView from '../ImageView'
import JsonTree from '../JsonTree'
import ObjectView from '../ObjectView'
import MapFrame from '../MapFrame'
/*
<widgets
  ref="messagesView"
  :active="activeWidgetWindow === 'messagesView'"
  v-model="isWidgetsMessageActive"
  :config="messageWidgetsViewConfig"
  :actions="widgetsHandleActions"
  :controls="widgetWindowControls"
  :view-model="widgetsViewModel.messages"
  @change-view-model="data => widgetsChangeViewModelHandler('messages', data)"
  @active="activateWidgetWindow('messagesView')"
  @close="closeMessageWidgetsHandler"
  @next="nextWidgetsMessage"
  @prev="prevWidgetsMessage"
/>
*/
export default {
  data () {
    return {
      isWidgetsMessageActive: false,
      widgetsViewedMessage: null
    }
  },
  computed: {
    fieldsDevicesMetaData () {
      const schema = get(this.$refs, 'messages.cols', undefined)
      let result = {}
      if (schema) {
        const cols = Object.values(schema.enum)
        const activeCols = get(this.$refs, 'messages.$refs.scrollList.activeCols', []).reduce((res, col) => {
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
    messageWidgetsViewConfig () {
      const content = this.widgetsViewedMessage
      const config = {}
      if (content) {
        const description = `${content.ident ? `<div style="font-size: 1.1rem">${content.ident}</div>` : ''}${content.timestamp ? `<div style="font-size: .8rem">${date.formatDate(content.timestamp * 1000, 'DD/MM/YYYY HH:mm:ss')}</div>` : ''}`
        if (content['position.latitude'] && content['position.longitude']) {
          config.position = {
            titleIcon: 'mdi-map-marker-radius',
            wrapper: MapFrame
          }
        }
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
          meta: this.fieldsDevicesMetaData,
          action: this.messagesWidgetActionHandler,
          data: content
        }
        Object.keys(content).forEach(name => {
          if (
            JSON.stringify(content[name]).match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/) ||
            name.indexOf('image.bin.') === 0
          ) {
            let data = content[name]
            if (name.indexOf('image.bin.') === 0) {
              data = `data:image/${name.split('.')[2]};base64,${content[name].replace(/^data:image\/\w*;base64,\s/, '')}`
            }
            config[`image{${name}}`] = {
              title: `Image{${name}}`,
              wrapper: ImageView,
              data
            }
          }
        })
      }
      return config
    }
  },
  methods: {
    setWidgetsMessageView (content) {
      this.widgetsViewedMessage = { ...content }
      const marker = { latlng: [content['position.latitude'], content['position.longitude']], direction: content['position.direction'] }
      if (!this.isWidgetsMessageActive) {
        if (this.beforeEnableWidgetByPane) {
          this.beforeEnableWidgetByPane('messages')
        }
        this.isWidgetsMessageActive = true
      }
      this.$nextTick(() => {
        const map = this.$refs.messagesView.ref('position')
        if (map) {
          map.clear()
          if (this.mapExtendConfig) {
            map.addConfig(this.mapExtendConfig)
          }
          if (marker) {
            map.autobounds(true).addNamedMarkers([marker])
          }
          map.send()
        }
      })
      this.activateWidgetWindow('messagesView')
    },
    messageWidgetsActions (type, data) {
      const isActive = this.isWidgetsMessageActive
      const view = this.$refs.messagesView
      switch (type) {
        case 'position': {
          this.setWidgetsMessageView(data.content)
          view.setTab(type)
          break
        }
        case 'show': {
          this.setWidgetsMessageView(data.content)
          view.setTab('message')
          break
        }
        case 'object': {
          this.setWidgetsMessageView(data.content)
          if (!isActive) {
            view.setTab('object')
          }
          break
        }
        case 'select': {
          this.setWidgetsMessageView(data.content)
          break
        }
        case 'image': {
          this.setWidgetsMessageView(data.content)
          let firstImage
          Object.keys(this.messageWidgetsViewConfig).some(name => {
            const isImage = name.indexOf('image') === 0
            firstImage = name
            return isImage
          })
          firstImage && view.setTab(firstImage)
          break
        }
        case 'traffic': {
          this.toTrafficHandler(data)
          break
        }
        case 'hex': {
          this.toHexHandler(data)
          break
        }
      }
    },
    closeMessageWidgetsHandler () {
      if (this.$refs.messages) {
        this.$refs.messages.unselect()
      }
      if (this.trackWidgetMessageMarker) {
        this.addWidgetTrackMarker('track')
      }
    },
    nextWidgetsMessage () {
      this.$refs.messages.nextSelect()
    },
    prevWidgetsMessage () {
      this.$refs.messages.prevSelect()
    },
    messagesWidgetActionHandler ({ type, data }) {
      const list = get(this.$refs.messages.$refs, 'scrollList', undefined)
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
      const map = this.$refs.messagesView.ref('position')
      if (map) {
        map.clear(['polygons', 'circles', 'corridors'])
        map.addConfig(config)
        map.send()
      }
    })
  }
}
