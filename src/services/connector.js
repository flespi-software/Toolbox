/*
 * The Vue 2 build kept the connection on `Vue.connector` and the endpoints on `Vue.prototype`.
 * Vue 3 has no shared constructor to hang them on, so they live here as module singletons.
 *
 * The connection itself is created by the library's own Vue 3 plugin — `dist/vue3-plugin.js` is the
 * only browser bundle flespi-io-js builds as ES (everything else, `dist/module.js` included, is UMD
 * with an uninteroped external `require("mqtt")`). `boot/flespi-io.js` installs it and hands the
 * instance back here; ESM live bindings mean every importer sees it from then on.
 */
import { reactive } from 'vue'
import { version } from '../../package.json'
import paramsSerializer from './paramsSerializer'

let rest = '',
  socket = ''
/* if local dev build */
if (DEV && LOCAL) {
  if (window.location.host.indexOf('localhost') !== -1) {
    rest = 'https://localhost:9005'
    socket = 'wss://localhost:9017'
  }
} else if (PROD) {
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
export const clientId = `toolbox-${version}${isDev ? '-dev' : ''}-${Math.random().toString(16).substr(2, 8)}`

export const connectionConfig = {
  socketConfig: {
    server: socket,
    clientId,
    mqttSettings
  },
  httpConfig: { server: rest || undefined, flespiApp: clientId, paramsSerializer }
}

export let connector = null

export function setConnector (value) {
  connector = value
}

/*
 * Endpoints are rewritten when the user switches region, and templates read them while rendering,
 * so they are kept reactive instead of being copied onto every component.
 */
export const endpoints = reactive({
  authHost: rest || 'https://flespi.io',
  server: rest || 'https://flespi.io',
  socketServer: socket || 'wss://mqtt.flespi.io',
  cdn: undefined,
  app: clientId
})
