import { defineBoot } from '#q-app'
import ConnectionPlugin from 'flespi-io-js/dist/vue3-plugin'
import { connectionConfig, setConnector, endpoints } from 'src/services/connector'
import { useMainStore } from 'src/stores/main'

/*
 * `$flespiServer` & co are read from templates and change when the region is switched, so they are
 * exposed as getters over the reactive `endpoints` object — a plain copy would never update.
 */
const globalEndpoints = {
  $authHost: 'authHost',
  $flespiServer: 'server',
  $flespiSocketServer: 'socketServer',
  $flespiCDN: 'cdn',
  $flespiApp: 'app'
}

export default defineBoot(({ app, store: pinia }) => {
  /* the plugin creates the connection and puts it on `$connector` */
  app.use(ConnectionPlugin, connectionConfig)
  const connector = app.config.globalProperties.$connector
  setConnector(connector)

  Object.keys(globalEndpoints).forEach(name => {
    Object.defineProperty(app.config.globalProperties, name, {
      get: () => endpoints[globalEndpoints[name]]
    })
  })

  const store = useMainStore(pinia)
  connector.socket.on('connect', (connack) => {
    const tokenInfo = JSON.parse(connack.properties.userProperties.token)
    store.setTokenInfo(tokenInfo)
    store.setSocketOffline(false)
  })
  connector.socket.on('error', (error) => {
    store.reqFailed(error)
  })
  connector.socket.on('offline', () => {
    store.setSocketOffline(true)
  })
  if (window) {
    window.addEventListener('beforeunload', () => {
      connector.socket.close(true)
    })
  }
})
