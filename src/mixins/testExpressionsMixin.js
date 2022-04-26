import ExpressionTestDialog from '../components/ExpressionTestDialog.vue'
export default {
  methods: {
    showExprTest (token, cols, messages) {
      const activeCols = cols.reduce((res, col) => {
        if (!col.__dest) {
          res.push(col.name)
        }
        return res
      }, [])
      this.$q.dialog({
        component: ExpressionTestDialog,
        parent: this,
        data: messages,
        columns: activeCols,
        token: token,
        noRouteDismiss: true
      })
    }
  }
}
