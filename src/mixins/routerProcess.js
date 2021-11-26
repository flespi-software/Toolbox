export default {
  methods: {
    updateRoute (route, needReplace = false) {
      const resRoute = {
        name: route.name || this.$route.name,
        path: route.path || this.$route.path,
        meta: {...this.$route.meta, ...route.meta},
        params: {...this.$route.params, ...route.params},
        query: {...this.$route.query, ...route.query}
      }
      return needReplace ?
        this.$router.replace(resRoute).catch((e) => {}) :
        this.$router.push(resRoute).catch((e) => {})
    },
    processRoute (params, route) {
      const getParam = (name) => route.params[name] || route.query[name]
      if (Array.isArray(params)) {
        params.forEach(name => {
          const value = getParam(name)
          if (this[name] !== value) {
            this[name] = value
          }
        })
      } else {
        Object.keys(params).forEach(name => {
          const handler = params[name],
            value = getParam(name)
          handler(value)
        })
      }
    }
  }
}
