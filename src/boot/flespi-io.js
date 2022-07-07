/* eslint-disable */
import VueConnection from 'flespi-io-js/dist/vue-plugin'
import { version } from '../../package.json'

let rest = '',
  socket = ''
/* if local dev build */
if (DEV && LOCAL) {
  if (window.location.host.indexOf('localhost') !== -1) {
    rest = 'https://localhost:9005'
    socket = 'wss://localhost:9017'
  }
}  else if (PROD) {
  if (window.location.host.indexOf('flespi.io') === -1) {
    rest = `https://${window.location.hostname}:9005`
    socket = `wss://${window.location.hostname}:9017`
  } else if (window.location.pathname.indexOf('/toolbox') !== -1) {
    rest = `https://${window.location.host}`
    socket = `wss://${window.location.host}`
  }
}

const isDev = DEV || (PROD && window.location.host.indexOf('flespi.io') === -1)
const mqttSettings = { protocolVersion: 5, wsOptions: { objectMode: false, perMessageDeflate: true } }
const clientId = `toolbox-${version}${isDev ? '-dev' : ''}-${Math.random().toString(16).substr(2, 8)}`
const connectionConfig = {
  socketConfig: {
    server: socket,
    clientId,
    mqttSettings
  },
  httpConfig: { server: rest ? rest : undefined, flespiApp: clientId }
}

export default ({ Vue, store }) => {
  Vue.prototype.$authHost = rest || 'https://flespi.io'
  Vue.prototype.$flespiServer = rest || 'https://flespi.io'
  Vue.prototype.$flespiSocketServer = socket || 'wss://mqtt.flespi.io'
  Vue.prototype.$flespiApp = clientId
  Vue.use(VueConnection, connectionConfig)
  Vue.connector.socket.on('connect', (connack) => {
    const tokenInfo = JSON.parse(connack.properties.userProperties.token)
    store.commit('setTokenInfo', tokenInfo)
    store.commit('setSocketOffline', false)
  })
  Vue.connector.socket.on('error', (error) => {
    store.commit('reqFailed', error)
  })
  Vue.connector.socket.on('offline', () => {
    store.commit('setSocketOffline', true)
  })
  if (window) {
    window.addEventListener('beforeunload', () => {
      Vue.connector.socket.close(true)
    })
  }
}
