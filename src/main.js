// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import router from './router'
import VueClipboard from 'vue-clipboard2'
import VueConnection from 'flespi-io-js/dist/vue-plugin'

let connectionConfig = {socketConfig: { clientId: `toolbox-${Math.random().toString(16).substr(2, 8)}` }}

/* if local dev build */
if (DEV && !SERVER) {
  connectionConfig = {
    httpConfig: { server: 'https://localhost', port: 9005 },
    socketConfig: { server: `wss://localhost:9017`, clientId: `toolbox-${Math.random().toString(16).substr(2, 8)}` }
  }
}

// check for pfront SERVER
if (PROD && SERVER) {
  if (window.location.host.indexOf('localhost:9004') !== -1 || window.location.host.indexOf('localhost:9005') !== -1 || window.location.host.indexOf('localhost:7004') !== -1) {
    connectionConfig = {
      httpConfig: { server: 'https://localhost', port: 9005 },
      socketConfig: { server: `wss://localhost:9017`, clientId: `toolbox-${Math.random().toString(16).substr(2, 8)}` }
    }
  }
}

Vue.use(VueConnection, connectionConfig)

let store = require('./store/index').default

Vue.use(VueClipboard)

Vue.config.productionTip = false
Vue.use(Quasar) // Install Quasar Framework

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'mdi/css/materialdesignicons.min.css'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

/* eslint-disable no-new */
new Vue({
  el: '#q-app',
  router,
  store,
  render: h => h(require('./App').default)
})
