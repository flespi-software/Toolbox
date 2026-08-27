/*
 * Vue Router 3 committed a same-route query change straight away, so a burst of updateRoute calls
 * each saw what the previous one wrote and the query accumulated. Vue Router 4 resolves navigations
 * asynchronously: `this.$route` still holds the old query while the next call is already building
 * its own from it, and every write but the last is lost — the viewers fire several of these while
 * they set themselves up. The location being navigated to is tracked here, and each call merges
 * onto that rather than onto whatever has been committed so far.
 */
let pending = null

function isBlank (value) {
  return value === null || value === undefined || value === 'null'
}

export default {
  methods: {
    updateRoute (route, needReplace = false) {
      const name = route.name || this.$route.name
      const path = route.path || this.$route.path
      const key = name || path
      const base = pending && pending.key === key
        ? pending
        : { params: this.$route.params, query: this.$route.query }

      const params = { ...base.params, ...route.params }
      /*
       * Vue Router 3 left an optional param out of the path when it was null; Vue Router 4 writes it
       * out, which turned `/device/1/calc/intervals` into `/device/1/calcnull/intervals`.
       */
      Object.keys(params).forEach(param => {
        if (isBlank(params[param])) { delete params[param] }
      })
      const query = { ...base.query, ...route.query }
      pending = { key, params, query }

      /*
       * `name` and `path` used to be passed together. Vue Router 3 resolved by name when both were
       * there; Vue Router 4 lets `path` win and ignores `params` with it, so the route was rebuilt
       * from the old path and the params never applied.
       */
      const resRoute = name ? { name, params, query } : { path, query }
      const settle = () => { if (pending && pending.key === key && pending.query === query) { pending = null } }
      return (needReplace ? this.$router.replace(resRoute) : this.$router.push(resRoute))
        .then(settle, () => { settle() })
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
