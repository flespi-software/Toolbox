import MapFrame from '../MapFrame'
/*
<widgets
  ref="track"
  :active="activeWidgetWindow === 'track'"
  v-model="isWidgetsTrackActive"
  :siblingHeight="siblingHeight.track"
  :config="trackWidgetConfig"
  :controls="widgetWindowControls"
  @minimize="data => widgetsMinimizeHandler('track', data)"
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
      if (!map) { return }
      let track = data
      const marker = { latlng: [track[track.length - 1].lat, track[track.length - 1].lon], direction: track[track.length - 1].dir }
      track = track.map(marker => ([marker.lat, marker.lon]))
      map.clear().addPoints(track).addNamedMarkers([marker]).send()
      this.activateWidgetWindow('track')
    },
    closeWidgetsHandler () {}
  }
}
