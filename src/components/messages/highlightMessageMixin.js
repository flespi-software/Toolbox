export default {
  data () {
    return {
      highlightExplanation: 0,
      highlightDescription: '',
      highlightType: '',
      highlightLevel: ''
    }
  },
  watch: {
    item: function (val) {
      this.recalculateHighlight(val)
    }
  },
  mounted () {
    this.recalculateHighlight(this.item)
  },
  methods: {
    recalculateHighlight (item) {
      let highlightLevel = 0,
      highlightType = '',
      highlightDescription = '',
      highlightExplanation = ''
      if (item.timestamp < item['server.timestamp'] - 1800) { // >30min
        highlightType = 'grey'
        highlightLevel = 7
        highlightDescription = 'Message come from the past'
        highlightExplanation = 'flushing blackbox or wrong device settings'
      } else if (item.timestamp < item['server.timestamp'] - 600) { // 10-30min
        highlightType = 'grey'
        highlightLevel = 6
        highlightDescription = 'Message come from the past'
        highlightExplanation = 'flushing blackbox or wrong device settings'
      } else if (item.timestamp < item['server.timestamp'] - 120) { // 2-10min
        highlightType = 'grey'
        highlightLevel = 5
        highlightDescription = 'Message come from the past'
        highlightExplanation = 'flushing blackbox or wrong device settings'
      } else if (item.timestamp - 1800 > item['server.timestamp']) { // >30min
        highlightType = 'orange'
        highlightLevel = 10
        highlightDescription = 'Message come from the future'
        highlightExplanation = 'wrong device settings'
      } else if (item.timestamp - 60 > item['server.timestamp']) { // 1-30min
        highlightType = 'orange'
        highlightLevel = 7
        highlightDescription = 'Message come from the future'
        highlightExplanation = 'wrong device settings'
      } else if (item.timestamp - 1 > item['server.timestamp']) { // < 1sec-1min
        highlightType = 'orange'
        highlightLevel = 4
        highlightDescription = 'Message come from the future'
        highlightExplanation = 'wrong device settings'
      }
      if (item['rest.timestamp']) {
        highlightType = 'blue'
        highlightLevel = 4
        highlightDescription = 'Message registered with REST API request'
      }
      this.highlightLevel = highlightLevel
      this.highlightType = highlightType
      this.highlightDescription = highlightDescription
      this.highlightExplanation = highlightExplanation
    }
  }
}
