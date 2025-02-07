import MapFrame from '../MapFrame'
import { date } from 'quasar'
/*
<widgets
  ref="track"
  :active="activeWidgetWindow === 'track'"
  v-model="isWidgetsTrackActive"
  :config="trackWidgetConfig"
  :controls="widgetWindowControls"
  :view-model="widgetsViewModel.track"
  @change-view-model="data => widgetsChangeViewModelHandler('track', data)"
  @active="activateWidgetWindow('track')"
  @close="closeWidgetsHandler"
/>
*/
export default {
  data () {
    return {
      isWidgetsTrackActive: false,
      trackWidgetMessageMarker: undefined,
      trackWidgetLBSMessageMarker: undefined,
      trackWidgetConfig: {
        track: {
          title: 'Track',
          wrapper: MapFrame
        }
      }
    }
  },
  methods: {
    showWidgetTrack (track) {
      if (!this.isWidgetsTrackActive && track.length) {
        this.isWidgetsTrackActive = true
      }
      this.$nextTick(() => this.setWidgetTrackView('track', track))
    },
    setWidgetTrackView (type, data) {
      const map = this.$refs.track.ref(type)
      if (!map || !data) { return }
      let track = data
      const markerData = track[track.length - 1]
      let marker
      if (markerData) {
        marker = { latlng: [markerData.lat, markerData.lon], direction: markerData.dir, label: 'Last position' }
      }
      track = track.map(marker => ([marker.lat, marker.lon]))
      map.clear()
      if (track.length) {
        map.addPoints(track)
      }
      if (marker) {
        map.addNamedMarkers({ position: marker, ...this.trackWidgetMessageMarker, ...this.trackWidgetLBSMessageMarker })
      }
      map.send()
      this.activateWidgetWindow('track')
    },
    addWidgetTrackMarker (type, data) {
      if (!this.isWidgetsTrackActive) { return }
      const map = this.$refs.track.ref(type)
      if (!map) { return }
      if (data) {
        const { content } = data
        if (!Array.isArray(content)){
          const marker = {
            message: {
              latlng: [
                content['position.latitude'],
                content['position.longitude']
              ],
              direction: content['position.direction'],
              color: '#f0f',
              label: 'Message',
              setpoints: [[content['position.latitude'],content['position.longitude']]]
            }
          }
          this.trackWidgetMessageMarker = marker
          map.addNamedMarker(marker)

          if (content['position.lbs.latitude'] && content['position.lbs.longitude']) {
            const lbsmarker = {
              lbsmessage: {
                latlng: [
                  content['position.lbs.latitude'],
                  content['position.lbs.longitude']
                ],
                color: '#09f',
                label: 'LBS Position',
                setpoints: [[content['position.lbs.latitude'],content['position.lbs.longitude']]]
              }
            }
            this.trackWidgetLBSMessageMarker = lbsmarker
            map.addNamedMarker(lbsmarker)
          }
        } else {
          const markers = {}
          content.forEach(el => {
            markers[el.timestamp] = {
              latlng: [
                el['position.latitude'],
                el['position.longitude']
              ],
              direction: el['position.direction'],
              color: '#f0f',
              title: this.formatDate(el.timestamp * 1000, 'YYYY-MM-DD HH:mm:ss.SSS'),
              setpoints: [[el['position.latitude'],el['position.longitude']]]
            }
          })
          map.addNamedMarkers({ ...markers, ...this.trackWidgetMessageMarker, ...this.trackWidgetLBSMessageMarker })
        }
      } else {
        this.trackWidgetLBSMessageMarker = undefined
        this.trackWidgetMessageMarker = undefined
      }
      map.send()
    },
    closeWidgetsHandler () {},
    trackWidgetClear () {
      this.trackWidgetLBSMessageMarker = undefined
      this.trackWidgetMessageMarker = undefined
    },

    formatDate: date.formatDate
  }
}
