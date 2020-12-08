import MapFrame from '../MapFrame'
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
        marker = { latlng: [markerData.lat, markerData.lon], direction: markerData.dir }
      }
      track = track.map(marker => ([marker.lat, marker.lon]))
      map.clear()
      if (track.length) {
        map.addPoints(track)
      }
      if (marker) {
        map.addNamedMarkers([marker])
      }
      map.send()
      this.activateWidgetWindow('track')
    },
    closeWidgetsHandler () {}
  }
}
