import Vue from 'vue'
import VueRouter from 'vue-router'
import config from './config.json'

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

function getIndexChildrenRoutes (config) {
  return Object.keys(config).reduce((result, moduleName) => {
    result.push({
      path: moduleName,
      component: load(`${moduleName}/Index`),
      meta: {moduleName}
    })
    result.push({
      path: `${moduleName}/:id`,
      component: load(`${moduleName}/Index`),
      meta: {moduleName}
    })
    return result
  }, [])
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  routes: [
    {
      path: '/',
      component: load('Index'),
      children: [
        ...getIndexChildrenRoutes(config),
        {
          path: 'view/:type/:id',
          name: 'module',
          component: load('Index')
        }
      ]
    },
    { path: '/token/:token/type/:type/id/:id', component: load('Index') },
    { path: '/token/:token/type/:type/id/:id/fullscreen/:fullscreen', component: load('Index') },
    { path: '/login', component: load('Login') },
    { path: '/login/:token', component: load('Login') }
  ]
})
