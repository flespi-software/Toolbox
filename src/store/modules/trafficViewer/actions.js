import Vue from 'vue'
import get from 'lodash/get'
function getFromTo (val) {
  const now = val || Date.now(),
    from = new Date(now).setHours(0, 0, 0, 0),
    to = from + 86399999.999
  return { from, to }
}
async function initTime ({ state, commit }) {
  let timestamp = Date.now()
  try {
    const params = { data: { count: 1, reverse: true } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
    Vue.$logger.info(`[trafficViewer]initTime`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
    timestamp = get(resp, 'data.result[0].timestamp', Math.floor(Date.now() / 1000))
    timestamp = Math.round(timestamp * 1000)
  } catch (e) {}
  const day = getFromTo(timestamp)
  commit('setFrom', day.from)
  commit('setTo', day.to)
}
async function getDevices ({ state, commit }) {
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  try {
    const resp = await Vue.connector.gw.getChannelsIdents(state.active, state.deviceFilter ? `*${state.deviceFilter}*` : '*')
    commit('reqStart', { endpoint: 'getChannelsIdents', ids: state.active, ident: state.deviceFilter ? `*${state.deviceFilter}*` : '*' })
    let idents = get(resp, 'data.result', [])
    idents = idents.reduce((idents, { ident, size }) => {
      idents[ident] = { ident, size }
      return idents
    }, {})
    commit('setDevices', idents)
  } catch (e) {
    commit('reqFailed', e)
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', false)
  }
}
async function getMessages ({ state, commit }) {
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  try {
    const now = Date.now()
    const to = state.to > now ? now : state.to
    const params = { data: { from: state.from / 1000, to: to / 1000, count: state.limit } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
    Vue.$logger.info(`[trafficViewer]getMessages`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
    const messages = get(resp, 'data.result', [])
    commit('setMessages', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', false)
  }
}

async function getMessagesTail ({ state, commit }) {
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  try {
    const now = Date.now()
    const to = state.to > now ? now : state.to
    const params = { data: { count: state.limit, reverse: true, from: state.from / 1000, to: to / 1000 } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
    Vue.$logger.info(`[trafficViewer]getMessagesTail`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
    const messages = get(resp, 'data.result', [])
    messages.reverse()
    commit('setMessages', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', false)
  }
}
let requestStatus = false
async function getMessagesNext ({ state, commit }) {
  if (!state.messages.length || requestStatus || state.messagePolling) { return }
  requestStatus = true
  let messages = []
  try {
    const from = state.messages[state.messages.length - 1].timestamp + 0.000001
    const params =  { data: { count: state.limit, from, to: state.to / 1000 } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
    Vue.$logger.info(`[trafficViewer]getMessagesNext`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
    messages = get(resp, 'data.result', [])
    commit('setMessagesAppend', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  requestStatus = false
  return messages
}

async function getMessagesPrev ({ state, commit }) {
  if (!state.messages.length || requestStatus) { return }
  requestStatus = true
  let messages = []
  try {
    const to = state.messages[0].timestamp - 0.000001
    const params = { data: { count: state.limit, from: state.from / 1000, to, reverse: true } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
    Vue.$logger.info(`[trafficViewer]getMessagesPrev`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
    messages = get(resp, 'data.result', [])
    messages.reverse()
    commit('setMessagesPrepend', messages)
  } catch (e) {
    commit('reqFailed', e)
  }
  requestStatus = false
  return messages
}

async function pollingGetDevices ({ state, commit }) {
  await Vue.connector.socket.subscribe({
    name: `flespi/log/gw/channels/${state.active}/connections/+/identified`,
    handler: (value, topic, packet) => {
      value = JSON.parse(value.toString())
      const ident = value.ident
      if (!state.devices[ident] && ident.indexOf(state.deviceFilter) !== -1) {
        Vue.set(state.devices, ident, { ident })
      }
    }
  })
  state.realtimeEnabled = true
  Vue.$logger.info(`[trafficViewer]pollingGetDevices`)
  Vue.$logger.info(`[trafficViewer]subscribe: flespi/log/gw/channels/${state.active}/connections/+/identified`)
}
async function removePollingGetDevices ({ state, commit }) {
  state.realtimeEnabled = false
  await Vue.connector.socket.unsubscribe(`flespi/log/gw/channels/${state.active}/connections/+/identified`)
  Vue.$logger.info(`[trafficViewer]removePollingGetDevices`)
  Vue.$logger.info(`[trafficViewer]unsubscribe: flespi/log/gw/channels/${state.active}/connections/+/identified`)
}
let mesagesPollingId = 0
function pollingGetMessages ({ state, commit }) {
  mesagesPollingId = setInterval(async () => {
    try {
      const from = state.messages[state.messages.length - 1].timestamp + 0.000001
      const to = Math.ceil(Date.now() / 1000)
      const params = { data: { from, to } }
      const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
      Vue.$logger.info(`[trafficViewer]pollingGetMessages`)
      commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
      const messages = get(resp, 'data.result', [])
      commit('setMessagesAppend', messages)
    } catch (e) {
      commit('reqFailed', e)
    }
  }, 10000)
  state.messagePolling = true
}
function removePollingGetMessages ({ state, commit }) {
  clearInterval(mesagesPollingId)
  mesagesPollingId = 0
  state.messagePolling = false
  Vue.$logger.info(`[trafficViewer]removePollingGetMessages`)
}
async function getDevicePreview ({ state }, device) {
  let messages = []
  try {
    const params = { data: { count: 20, reverse: true } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, device.ident, params)
    Vue.$logger.info(`[trafficViewer]getDevicePreview`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: device.ident, params })
    messages = get(resp, 'data.result', [])
  } catch (e) {
    commit('reqFailed', e)
  }
  return messages
}
async function getExportData ({ state, commit }, { from, to }) {
  let messages = []
  try {
    const params = { data: { from, to } }
    const resp = await Vue.connector.gw.getChannelsIdentsPackets(state.active, state.ident, params)
    Vue.$logger.info(`[trafficViewer]getExportData`)
    commit('reqStart', { endpoint: 'getChannelsIdentsPackets', ids: state.active, ident: state.ident, params })
    messages = get(resp, 'data.result', [])
    console.log(messages);
  } catch (e) {
    commit('reqFailed', e)
  }
  return messages
}
export default {
  initTime,
  getMessages,
  getMessagesTail,
  getMessagesNext,
  getMessagesPrev,
  getDevices,
  pollingGetDevices,
  removePollingGetDevices,
  pollingGetMessages,
  removePollingGetMessages,
  getDevicePreview,
  getExportData
}
