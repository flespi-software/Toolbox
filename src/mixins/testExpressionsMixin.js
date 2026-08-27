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
      /* Quasar 2 hands the props to a custom dialog through componentProps; `parent` is gone */
      this.$q.dialog({
        component: ExpressionTestDialog,
        componentProps: {
          data: messages,
          columns: activeCols,
          token: token
        }
      })
    }
  }
}
