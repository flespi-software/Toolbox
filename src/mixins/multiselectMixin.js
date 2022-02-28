import range from 'lodash/range'
export default {
  data () {
    return {
      selectionMode: false
    }
  },
  methods: {
    enableSelectionMode (event) {
      if (event.shiftKey || event.ctrlKey || event.metaKey) {
        this.selectionMode = true
      }
    },
    disableSelectionMode (event) {
      if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
        this.selectionMode = false
      }
    },
    multiselectProcess ({ selected, index, event = {} }) {
      selected = [...selected]
      if (event.shiftKey) {
        if (selected[0]) {
          if (selected[0] > index) {
            selected = range(index, selected[0] + 1)
          } else {
            selected = range(selected[0], index + 1)
          }
        } else {
          selected = [index]
        }
      } else if (event.ctrlKey || event.metaKey) {
        if (selected.includes(index)) {
          selected.splice(selected.indexOf(index), 1)
        } else {
          selected = [...selected, index]
        }
      } else {
        selected = [index]
      }
      return selected
    }
  },
  created() {
    window.addEventListener('keydown', this.enableSelectionMode)
    window.addEventListener('keyup', this.disableSelectionMode)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.enableSelectionMode)
    window.removeEventListener('keyup', this.disableSelectionMode)
  },
}
