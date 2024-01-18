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
    const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
    Vue.$logger.info(`[webhookTraffic]getMessages`)
    commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
    timestamp = get(resp, 'data.result[0].timestamp', Math.floor(Date.now() / 1000))
    timestamp = Math.round(timestamp * 1000)
  } catch (e) {}
  const day = getFromTo(timestamp)
  commit('setFrom', day.from)
  commit('setTo', day.to)
}
async function getMessages ({ state, commit }) {
  if (typeof state.isLoading !== 'undefined') {
    Vue.set(state, 'isLoading', true)
  }
  try {
    const now = Date.now()
    const to = state.to > now ? now : state.to
    const params = { data: { from: state.from / 1000, to: to / 1000, count: state.limit } }
    const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
    Vue.$logger.info(`[webhookTraffic]getMessages`)
    commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
    const messages = get(resp, 'data.result', [])
    commit('setMessages', messages)
  } catch (e) {
    console.log('------------- 1')
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
    const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
    Vue.$logger.info(`[webhookTraffic]getMessagesTail`)
    commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
    const messages = get(resp, 'data.result', [])
    messages.reverse()
    commit('setMessages', messages)
  } catch (e) {
    console.log('------------- 2')
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
    const params = { data: { count: state.limit, from, to: state.to / 1000 } }
    const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
    Vue.$logger.info(`[webhookTraffic]getMessagesNext`)
    commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
    messages = get(resp, 'data.result', [])
    commit('setMessagesAppend', messages)
  } catch (e) {
    console.log('------------- 3')
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
    const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
    Vue.$logger.info(`[webhookTraffic]getMessagesPrev`)
    commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
    messages = get(resp, 'data.result', [])
    messages.reverse()
    commit('setMessagesPrepend', messages)
  } catch (e) {
    console.log('------------- 4')
    commit('reqFailed', e)
  }
  requestStatus = false
  return messages
}
let mesagesPollingId = 0
function pollingGetMessages ({ state, commit }) {
  mesagesPollingId = setInterval(async () => {
    try {
      const from = state.messages[state.messages.length - 1].timestamp + 0.000001
      const to = Math.ceil(Date.now() / 1000)
      const params = { data: { from, to } }
      const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
      Vue.$logger.info(`[webhookTraffic]pollingGetMessages`)
      commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
      const messages = get(resp, 'data.result', [])
      commit('setMessagesAppend', messages)
    } catch (e) {
      console.log('------------- 5')
      commit('reqFailed', e)
    }
  }, 10000)
  state.messagePolling = true
}
function removePollingGetMessages ({ state, commit }) {
  clearInterval(mesagesPollingId)
  mesagesPollingId = 0
  state.messagePolling = false
  Vue.$logger.info(`[webhookTraffic]removePollingGetMessages`)
}
async function getExportData ({ state, commit }, { from, to }) {
  let messages = []
  try {
    const params = { data: { from, to } }
    const resp = await Vue.connector.platform.getWebhooksPackets(state.active, params)
    Vue.$logger.info(`[webhookTraffic]getExportData`)
    commit('reqStart', { endpoint: 'getWebhooksPackets', ids: state.active, params })
    messages = get(resp, 'data.result', [])
  } catch (e) {
    console.log('------------- 6')
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
  pollingGetMessages,
  removePollingGetMessages,
  getExportData
}
