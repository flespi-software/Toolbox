import { date } from 'quasar'
import ImageView from '../ImageView'
import JsonTree from '../JsonTree'
import ObjectView from '../ObjectView'
import MapFrame from '../MapFrame'
/*
<widgets
  ref="messageView"
  :active="activeWidgetWindow === 'messageView'"
  v-model="isWidgetsMessageActive"
  :siblingHeight="siblingHeight.message"
  :config="messageWidgetsViewConfig"
  :actions="widgetsHandleActions"
  :controls="widgetWindowControls"
  @minimize="data => widgetsMinimizeHandler('message', data)"
  @active="activateWidgetWindow('messageView')"
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
    messageWidgetsViewConfig () {
      const content = this.widgetsViewedMessage
      const config = {}
      if (content) {
        if (content['position.latitude'] && content['position.longitude']) {
          config.position = {
            title: 'Position',
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
        Object.keys(content).forEach(name => {
          if (
            content[name].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/) ||
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
      const marker = [content['position.latitude'], content['position.longitude']]
      if (!this.isWidgetsMessageActive) {
        this.isWidgetsMessageActive = true
        if (!this.widgetStyle.bottom) {
          this.$nextTick(() => this.$refs.messageView.minimize('bottom'))
        }
      }
      this.$nextTick(() => {
        const map = this.$refs.messageView.ref('position')
        if (map) {
          map.clear().autobounds(true).addMarkers([marker]).send()
        }
      })
      this.activateWidgetWindow('messageView')
    },
    messageWidgetsActions (type, data) {
      const isActive = this.isWidgetsMessageActive
      this.setWidgetsMessageView(data.content)
      const view = this.$refs.messageView
      switch (type) {
        case 'position': {
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
        case 'image': {
          let firstImage
          Object.keys(this.messageWidgetsViewConfig).some(name => {
            const isImage = name.indexOf('image') === 0
            firstImage = name
            return isImage
          })
          firstImage && view.setTab(firstImage)
          break
        }
      }
    },
    closeMessageWidgetsHandler () {
      this.$refs.messages.unselect()
    },
    nextWidgetsMessage () {
      this.$refs.messages.nextSelect()
    },
    prevWidgetsMessage () {
      this.$refs.messages.prevSelect()
    }
  }
}
