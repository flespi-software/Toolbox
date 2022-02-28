export default {
  methods: {
    actionHandler ({ index, type, content }) {
      switch (type) {
        case 'view': {
          this.itemClickHandler({ index, content })
          break
        }
        case 'copy': {
          this.copyMessageHandler({ index, content })
          break
        }
        case 'expression': {
          this.showExprTest(
            this.$store.state.token,
            this.cols.schemas[this.cols.activeSchema].cols,
            this.selected.map(index => this.messages[index])
          )
          break
        }
        default: {
          this.$emit(`action-${type}`, { index, content })
          break
        }
      }
    }
  }
}
